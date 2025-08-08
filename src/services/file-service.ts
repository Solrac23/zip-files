import { createWriteStream, type Dirent, type WriteStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { ErrorStatus } from '../error/enums/error-status';
import { IOError } from '../error/io-error';
import type { PathFile } from '../model/path-file';

export class FileService {
	private pathFile!: PathFile;

	public async readFilesPath(dirPath: string[]): Promise<void> {
		const dir = dirPath[0];
		const files: Dirent<string>[] = await readdir(dir, { withFileTypes: true });

		files.forEach(file => {
			if (!file.isFile()) {
				throw new IOError({
					name: ErrorStatus.DIRECTORY_EMPTY,
					message: `It\'s not a file`,
					cause: `${file.name}`,
				});
			}
			const fileName: string = file.name;
			console.log(fileName);
		});
		console.log('Appeding files!');
	}

	public async writeFilsPath(dir: string, name: string): Promise<WriteStream> {
		const createWrite: WriteStream = createWriteStream(dir + name);
		return createWrite;
	}
}
