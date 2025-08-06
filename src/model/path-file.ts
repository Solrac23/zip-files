import { createReadStream } from 'node:fs';

export class PathFile {
	private path: Array<string>;
	private file: string | undefined;

	public constructor(file?: string, ...path: Array<string>) {
		this.file = file;
		this.path = path;
	}

	public getFile(): string | undefined {
		return this.file;
	}

	public setFile(file: string): void {
		this.file = file;
	}

	public getPath(): Array<string> {
		return this.path;
	}

	public addPath(path: string): void {
		this.path.push(path);
	}

	public async readPathFile(files: string[]): Promise<void> {
		const readFiles = files.forEach(file => {
			createReadStream(file, { encoding: 'utf-8' });
		});
	}
}
