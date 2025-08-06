import { access, constants } from 'node:fs/promises';
import { isAbsolute, join, sep, win32 } from 'node:path';
import type { IOsType } from '../interface/i-os-type';

export class PathFileService {
	private osType: IOsType;

	public constructor(osType: IOsType) {
		this.osType = osType;
	}

	public removePaths(arr?: Array<string>): void {
		if (arr?.length === 0 || arr?.length === undefined) {
			throw new Error('Array be empty');
		}

		for (let i: number = 0; i <= arr?.length; i++) {
			arr?.shift();
		}
	}

	public async isDirectoryExists(path: string): Promise<boolean> {
		if (!isAbsolute(path)) {
			console.error(`Path provied is not absolute: ${path}`);
			return false;
		}
		try {
			await access(path, constants.F_OK);
			return true;
		} catch (err: unknown) {
			console.error(
				`Error checking directory: ${err instanceof Error ? err.message : String(err)}`
			);
			return false;
		}
	}

	public safeJoin(
		paths: Array<string>,
		cb?: (arr?: Array<string>) => void
	): string {
		const isWindows: string =
			this.osType.getOsPlatform() === 'win32' ? win32.sep : sep;
		const joinPath: string = join(...paths);

		const pathAbsolute: string = joinPath.split(isWindows).join(isWindows);
		if (pathAbsolute === '') {
			throw new TypeError('join path must not be empty');
		}

		if (cb) {
			cb(paths);
		}
		return pathAbsolute;
	}
}
