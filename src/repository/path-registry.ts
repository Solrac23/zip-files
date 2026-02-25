import { ErrorStatus } from '../error/enums/error-status';
import { IOError } from '../error/io-error';
import type { PathFile } from '../model/path-file';

export class PathRegistry {
	private pathFiles: Set<PathFile>;

	public constructor() {
		this.pathFiles = new Set();
	}

	public getPathFiles(): ReadonlySet<PathFile> {
		return this.pathFiles;
	}

	public addPathFile(pathFile: PathFile): void {
		if (!pathFile) {
			throw new IOError({
				name: ErrorStatus.INVALID_PATHFILE,
				message: 'PathFile cannot be null or undefined',
			});
		}
		this.pathFiles.add(pathFile);
	}

	public clear(): void {
		this.pathFiles.clear();
	}
}
