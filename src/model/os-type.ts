import { homedir, platform } from 'node:os';
import type { IOsType } from '../interface/i-os-type';

export class OsType implements IOsType {
	private osPlatform: NodeJS.Platform;
	private osHomedir: string;

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
}
