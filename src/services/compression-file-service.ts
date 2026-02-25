// biome-ignore assist/source/organizeImports: <false>
import archiver from 'archiver';
import { join } from 'node:path';
import type { Logger } from 'winston';
import { ErrorStatus } from '../error/enums/error-status';
import { IOError } from '../error/io-error';
import type { ICompressionService } from '../interface/i-compression-service';
import type { IFileService } from '../interface/i-file-service';
import { Log } from '../utils/logger';

export class CompressionFileService implements ICompressionService {
	private logger: Logger;
	private fileService: IFileService;

	public constructor(fileService: IFileService) {
		this.fileService = fileService;
		this.logger = Log.logger();
	}

	/**
	 * Metodo responsavel por comprimir todos os aquivos e pastas de um diretorio
	 * @param dir Diretorio do arquivo
	 * @param files Arquivos do diretorio
	 * @param outputZipPath Arquivo de saida
	 */
	public async compressFiles(
		dir: string,
		files: string[],
		outputZipPath: string
	): Promise<void> {
		if (!dir && !files && !outputZipPath) {
			throw new IOError({
				name: ErrorStatus.INVALID_DIRECTORY_FILE_OUTPUT,
				message: 'Invlid directory, file and output',
			});
		}

		try {
			const output = await this.fileService.createWriteStreamForFile(
				dir,
				outputZipPath
			);
			const archive = archiver('zip', {
				zlib: { level: 9 },
				comment: 'Arquivos zipados',
			});

			await new Promise<void>((resolve, reject) => {
				output.on('error', err => {
					reject(new Error(err.message));
				});

				output.on('close', () => {
					const bytes: number = archive.pointer() / 1024 / 1024;
					const sizeFile: string = bytes.toFixed(1);
					this.logger.info(`Arquivos compactados em: ${dir}/${outputZipPath}`);
					this.logger.info(`${sizeFile} MB total bytes`);
					resolve();
				});

				archive.pipe(output);
				for (const file of files) {
					const fullPath = join(dir, file);
					this.logger.info(`Compactando arquivo: ${fullPath}`);
					archive.file(fullPath, { name: file });
				}

				archive.on('warning', err => {
					if (err.code === 'ENOENT') {
						this.logger.warn(err.message, { data: err.data });
					} else {
						reject(err);
					}
				});

				archive.on('error', err => {
					this.logger.error(`${err.name} ${err.message}`, { data: err.data });
					reject(err);
				});
				archive.finalize();
			});
		} catch (err) {
			throw new IOError({
				name: ErrorStatus.CROMPRESSION_FAILED,
				message: 'Not possible compression it',
				cause: `${err instanceof Error ? err.message : String(err)}`,
			});
		}
	}
}
