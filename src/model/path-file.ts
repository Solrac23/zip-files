export class PathFile {
	private path: Array<string>;
	private file: Array<string>;

	public constructor(...path: Array<string>) {
		this.file = [] as string[];
		this.path = path;
	}

	public getFile(): Array<string> {
		return this.file;
	}

	public setFile(file: string): void {
		this.file.push(file);
	}

	public getPath(): Array<string> {
		return this.path;
	}

	public addPath(path: string): void {
		this.path.push(path);
	}
}
