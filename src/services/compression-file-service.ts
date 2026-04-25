// biome-ignore assist/source/organizeImports: <false>
import { IOError } from '@/error/io-error';
import type { ICompressionService } from '@/interface/i-compression-service';
import type { IFileService } from '@/interface/i-file-service';
import { Log } from '@/utils/log';
import archiver from 'archiver';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { Logger } from 'winston';

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
	 * @returns {Promise<void>} Promise que sera resolvida quando todos os arquivos forem compactados
	 * @throws {IOError} Se o diretorio, arquivo ou saida for invalido
	 */
	public async compressFiles(
		dir: string,
		files: string[],
		outputZipPath: string
	): Promise<void> {
		try {
			if (!dir && !files && !outputZipPath) {
				throw new IOError({
					name: 'INVALID_DIRECTORY_FILE_OUTPUT',
					message: 'Invlid directory, file and output',
				});
			}
			const output = await this.fileService.createWriteStreamForFile(
				dir,
				outputZipPath
			);
			const archive = archiver('zip', {
				zlib: { level: 9 },
				comment: 'Arquivos zipados',
			});

			output.on('finish', () => {
				this.logger.info('Compressao concluida com sucesso');
			});

			archive.on('warning', err => {
				if (err.code === 'ENOENT') {
					this.logger.warn(err.message, { data: err.data });
				} else {
					this.logger.warn(`Aviso do archiver: ${err.message}`);
				}
			});

			archive.pipe(output);
			await Promise.all(
				files.map(async file => {
					const fullPath = join(dir, file);
					const fileStats = await stat(fullPath);
					this.logger.info(`Compactando arquivo: ${fullPath}`);
					if (fileStats.isDirectory()) {
						archive.directory(fullPath, file);
					} else {
						archive.file(fullPath, { name: file });
					}
				})
			);

			await new Promise<void>((resolve, reject) => {
				output.on('close', () => {
					const bytes: number = archive.pointer() / 10 ** 6;
					const sizeFile: string = bytes.toFixed(1);
					this.logger.info(`Arquivos compactados em: ${dir}/${outputZipPath}`);
					this.logger.info(`${sizeFile} MB total bytes`);
					resolve();
				});

				output.on('error', err => {
					reject(new Error(err.message));
				});

				archive.on('error', err => {
					this.logger.error(`${err.name} ${err.message}`, { data: err.data });
					reject(err);
				});

				archive.finalize();
			});
		} catch (err) {
			throw new IOError({
				name: 'CROMPRESSION_FAILED',
				message: 'Not possible compression it',
				cause: `${err instanceof Error ? err.message : String(err)}`,
			});
		}
	}
}
