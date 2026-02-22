import { platform } from 'node:os';
import type { IOsType } from '../interface/i-os-type';

export class CheckPlatformService implements IOsType {
	private platform: NodeJS.Platform;

	public constructor() {
		this.platform = platform();
	}

	public getOsPlatform(): NodeJS.Platform {
		return this.platform;
	}
}
