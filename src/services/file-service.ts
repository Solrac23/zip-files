import { createWriteStream, type Dirent, type WriteStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { ErrorStatus } from '../error/enums/error-status';
import { IOError } from '../error/io-error';
import type { IFileService } from '../interface/i-file-service';
import { PathFile } from '../model/path-file';

export class FileService implements IFileService {
	private pathFile: PathFile;

	public constructor() {
		this.pathFile = new PathFile();
	}
	/**
	 * @method readFilesFromDirectory metodo responsavel por fazer a leitura do caminho
	 * @param dirPath Um atributo que aceita um array de diretorios e ler os seus arquivos
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
}
