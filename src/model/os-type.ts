import { homedir, platform } from 'node:os';
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

	public getOsPlatform(): NodeJS.Platform {
		return this.osPlatform;
	}

	public getOsHomedir(): string {
		return this.osHomedir;
	}

	public getPathfile(): Set<PathFile> {
		return this.pathFile;
	}
}
