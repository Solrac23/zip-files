import type { IOsType } from '../interface/i-os-type';

export class CheckPlatformService implements IOsType {
	private platform!: NodeJS.Platform;

	public getOsPlatform(): NodeJS.Platform {
		return this.platform;
	}
}
