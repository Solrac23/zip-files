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
}
