import { ErrorStatus } from '../error/enums/error-status';
import { IOError } from '../error/io-error';

export class PathFile {
	private paths: Array<string>;
	private files: Array<string>;
	private sizeFile: number;
	private create: Date;
	private modified: Date;

	public constructor(...initilaPaths: Array<string>) {
		this.paths = initilaPaths || Array<string>;
		this.files = [] as string[];
		this.sizeFile = 0;
		this.create = new Date();
		this.modified = new Date();
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

	public getSizeFile(): Readonly<number> {
		return this.sizeFile;
	}

	public setSizeFile(sizeFile: number): void {
		this.sizeFile = sizeFile;
	}

	public getCreate(): Readonly<Date> {
		return this.create;
	}

	public setCreate(create: Date) {
		this.create = create;
	}

	public getModified(): Readonly<Date> {
		return this.modified;
	}

	public setModified(modified: Date) {
		this.modified = modified;
	}
}
