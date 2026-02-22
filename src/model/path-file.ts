import { ErrorStatus } from '../error/enums/error-status';
import { IOError } from '../error/io-error';

export class PathFile {
	private basePath: string;
	private files: Array<string>;

	public constructor(basePath: string) {
		if (!basePath) {
			throw new IOError({
				name: ErrorStatus.INVALID_DIRECTORY,
				message: "basePath can't be empty",
			});
		}
		this.basePath = basePath;
		this.files = [] as string[];
	}

	public getBasePath(): Readonly<string> {
		return this.basePath;
	}

	public getFiles(): ReadonlyArray<string> {
		return this.files;
	}

	public addFiles(...newFiles: string[]): void {
		this.files.push(...newFiles);
	}
}
