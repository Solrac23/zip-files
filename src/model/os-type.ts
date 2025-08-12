import { homedir, platform } from 'node:os';
import { ErrorStatus } from '../error/enums/error-status';
import { IOError } from '../error/io-error';
import type { IOsType } from '../interface/i-os-type';
import type { PathFile } from './path-file';

export class OsType implements IOsType {
	private osPlatform: NodeJS.Platform;
	private osHomedir: string;

	private pathFile: Set<PathFile> = new Set();

	public constructor() {
		this.osPlatform = platform();
		this.osHomedir = homedir();
	}

	public getOsPlatform(): Readonly<NodeJS.Platform> {
		return this.osPlatform;
	}

	public getOsHomedir(): Readonly<string> {
		return this.osHomedir;
	}

	public getPathfile(): ReadonlySet<PathFile> {
		return new Set(this.pathFile);
	}

	public addPathFile(pathFile: PathFile): void {
		if (!pathFile) {
			throw new IOError({
				name: ErrorStatus.INVALID_PATHFILE,
				message: 'PathFile cannot be null or undefined',
			});
		}
		this.pathFile.add(pathFile);
	}
}
