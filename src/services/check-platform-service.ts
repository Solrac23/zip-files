import type { IOsType } from '@/interface/i-os-type';
import { platform } from 'node:os';

export class CheckPlatformService implements IOsType {
	private platform: NodeJS.Platform;

	public constructor() {
		this.platform = platform();
	}

	/**
	 * Retorna a plataforma do sistema operacional.
	 * @returns {NodeJS.Platform} Plataforma do sistema operacional.
	 */
	public getOsPlatform(): NodeJS.Platform {
		return this.platform;
	}
}
