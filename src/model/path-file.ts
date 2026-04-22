import { IOError } from '@/error/io-error';

export class PathFile {
	private basePath: string;
	private files: Array<string>;

	public constructor(basePath: string) {
		if (!basePath) {
			throw new IOError({
				name: 'INVALID_DIRECTORY',
				message: "basePath can't be empty",
			});
		}

		if (
			(basePath.startsWith('/') && basePath.length <= 1) ||
			(basePath.startsWith('C:\\') && basePath.length <= 3)
		) {
			throw new IOError({
				name: 'INVALID_DIRECTORY',
				message: "basePath can't be absolute",
			});
		}

		this.basePath = basePath;
		this.files = [];
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
