import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { ICompressionService } from '../interface/i-compression-service';
import type { IFileService } from '../interface/i-file-service';
import { PathRegistry } from '../repository/path-registry';
import { PathService } from '../services/path-service';

export class ArchiveOldFilesUseCase {
	public constructor(
		private pathRegistry: PathRegistry,
		private pathService: PathService,
		private fileService: IFileService,
		private compressionService: ICompressionService
	) {}

	public async execute(): Promise<void> {
		const pathFileList = Array.from(this.pathRegistry.getPathFiles());

		for (const pathFile of pathFileList) {
			try {
				const dir = pathFile.getBasePath();

				if (!(await this.pathService.isDirectoryExists(dir))) {
					console.warn(`Diretório não encontrado: ${dir}`);
					continue;
				}

				const readFiles = await this.fileService.readFilesFromDirectory(dir);
				pathFile.addFiles(...readFiles);

				const threeMonthsAgo: Date = new Date();
				threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
				const dirPath = pathFile.getBasePath();
				const fileNames = pathFile.getFiles();
				const filesToCompress: string[] = [];

				for (const fileName of fileNames) {
					const fullFilePath = join(dirPath, fileName);
					const fileStats = await stat(fullFilePath);
					const lastModified = fileStats.mtime;

					if (lastModified < threeMonthsAgo) {
						filesToCompress.push(fileName);
						console.log(`Compactando arquivo: ${fileName}`);
					} else {
						console.warn(
							`Arquivo ${fileName} nao compactado: modificado recentemente (menos de 3 meses)`
						);
					}
				}

				if (filesToCompress.length > 0) {
					const d: Date = new Date();
					const zipName = `compactado_${d.getDate()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}.zip`;
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
						console.error(err);
					}
				}
				console.log(pathFile.getBasePath());
				console.log('Process completed.');
			} catch (err) {
				console.error(err);
			}
		}
	}
}
