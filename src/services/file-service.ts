import { createWriteStream, type Dirent, type WriteStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { ErrorStatus } from '../error/enums/error-status';
import { IOError } from '../error/io-error';
import type { IFileService } from '../interface/i-file-service';

export class FileService implements IFileService {
	/**
	 * @method readFilesFromDirectory metodo responsavel por fazer a leitura do caminho
	 * @param dir Um atributo que aceita uma string de diretorio e ler os seus arquivos
	 * @returns Promise<string[]>
	 */
	public async readFilesFromDirectory(dir: string): Promise<string[]> {
		if (!dir) {
			throw new IOError({
				name: ErrorStatus.INVALID_DIRECTORY,
				message: 'Directory path is required',
				cause: dir,
			});
		}

		let files: Dirent<string>[];
		try {
			files = await readdir(dir, {
				withFileTypes: true,
				encoding: 'utf-8',
			});
		} catch (err) {
			throw new IOError({
				name: ErrorStatus.DIRECTORY_NOT_FOUND,
				message: 'Failed to read directory: '.concat(dir),
				cause: err instanceof Error ? err.message : String(err),
			});
		}

		if (files.length === 0) {
			throw new IOError({
				name: ErrorStatus.DIRECTORY_EMPTY,
				message: `Directory is empty: ${dir}`,
			});
		}

		return files.map(file => file.name);
	}

	/**
	 * @method createWriteStreamForFile metodo responsavel por criar o arquivo de saida
	 * @param dir Um atributo que aceita uma string de diretorio e ler os seus arquivos
	 * @param fileName Nome do arquivo zip
	 * @returns Promise<WriteSream>
	 */
	public async createWriteStreamForFile(
		dir: string,
		fileName: string
	): Promise<WriteStream> {
		if (!dir || !fileName) {
			throw new IOError({
				name: ErrorStatus.INVALID_FILE_PATH,
				message: 'Directory and file name are required',
			});
		}

		const fullPath = join(dir, fileName);
		try {
			const stream: WriteStream = createWriteStream(fullPath);
			return stream;
		} catch (err) {
			throw new IOError({
				name: ErrorStatus.FILE_CREATION_FAILED,
				message: `Failed to create write stream for: ${fullPath}`,
				cause: err instanceof Error ? err.message : String(err),
			});
		}
	}

	/**
	 * Criar um metodo para remover os arquivos depois de zipado
	 */
}
