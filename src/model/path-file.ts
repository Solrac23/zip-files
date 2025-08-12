import { ErrorStatus } from '../error/enums/error-status';
import { IOError } from '../error/io-error';

export class PathFile {
	private paths: Array<string>;
	private files: Array<string>;

	public constructor(...initilaPaths: Array<string>) {
		this.paths = initilaPaths || Array<string>;
		this.files = [] as string[];
	}

	public getPaths(): ReadonlyArray<string> {
		return this.paths;
	}

	public addPaths(path: string): void {
		if (!path) {
			throw new IOError({
				name: ErrorStatus.INVALID_DIRECTORY,
				message: "Path can't be empty",
			});
		}
		this.paths.push(path);
	}

	public getFiles(): ReadonlyArray<string> {
		return this.files;
	}

	public addFiles(...newFiles: string[]): void {
		this.files.push(...newFiles);
	}

	// public async loadFilesFromPath(index: number = 0): Promise<void> {
	// 	if (index < 0 || index >= this.paths.length) {
	// 		throw new IOError({
	// 			name: ErrorStatus.INVALID_INDEX,
	// 			message: `Invalid path index: ${index}`,
	// 		});
	// 	}
	// 	const dir = this.paths[index];
	// 	const loadedFiles = await this.fileService.readFilesFromDirectory(dir);
	// 	this.addFiles(...loadedFiles);
	// }

	// public async createWriteStream(fileName: string, pathIndex: number = 0) {
	// 	if (pathIndex < 0 || pathIndex >= this.paths.length) {
	// 		throw new IOError({
	// 			name: ErrorStatus.INVALID_INDEX,
	// 			message: `Invalid path index: ${pathIndex}`,
	// 		});
	// 	}
	// 	const dir = this.paths[pathIndex];
	// 	return this.fileService.createWriteStreamForFile(dir, fileName);
	// }
}
