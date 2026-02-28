import type { ICompressionService } from '@/interface/i-compression-service';
import type { IFileService } from '@/interface/i-file-service';
import type { PathRegistry } from '@/repository/path-registry';
import type { PathService } from '@/services/path-service';
import { DateFormatter } from '@/utils/date-formatter';
import { Log } from '@/utils/log';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { Logger } from 'winston';

export class ArchiveOldFilesUseCase {
	private readonly MONTHS_TO_KEEP: number = new Date().setMonth(
		new Date().getMonth() - 3
	);
	private logger: Logger;
	private dateFormatter: DateFormatter;

	public constructor(
		private pathRegistry: PathRegistry,
		private pathService: PathService,
		private fileService: IFileService,
		private compressionService: ICompressionService
	) {
		this.logger = Log.logger();
		this.dateFormatter = new DateFormatter();
	}

	public async execute(): Promise<void> {
		const pathFileList = Array.from(this.pathRegistry.getPathFiles());

		for (const pathFile of pathFileList) {
			try {
				const dir = pathFile.getBasePath();

				if (!(await this.pathService.isDirectoryExists(dir))) {
					this.logger.warn(`Diretório não encontrado: ${dir}`);
					continue;
				}

				const readFiles = await this.fileService.readFilesFromDirectory(dir);
				pathFile.addFiles(...readFiles);

				const dirPath = pathFile.getBasePath();
				const fileNames = pathFile.getFiles();
				const filesToCompress: string[] = [];

				for (const fileName of fileNames) {
					const fullFilePath = join(dirPath, fileName);
					const fileStats = await stat(fullFilePath);
					const lastModified = fileStats.mtime;

					if (lastModified.getTime() < this.MONTHS_TO_KEEP) {
						filesToCompress.push(fileName);
					} else {
						this.logger.warn(
							`Arquivo ${fileName} nao compactado: modificado recentemente (menos de 3 meses)`
						);
					}
				}

				if (filesToCompress.length > 0) {
					const zipName = `compactado_${this.dateFormatter.formatDate(new Date())}.zip`;
					try {
						await this.compressionService.compressFiles(
							dirPath,
							filesToCompress,
							zipName
						);
						await this.fileService.deleteFilesFromDirectory(
							dirPath,
							filesToCompress
						);
					} catch (err) {
						this.logger.error(err);
					}
				}
				this.logger.info(`${pathFile.getBasePath()}`);
				this.logger.info('Process completed.\n');
			} catch (err) {
				this.logger.error(err);
			}
		}
	}
}
