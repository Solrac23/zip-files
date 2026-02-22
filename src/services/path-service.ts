import { access, constants } from 'node:fs/promises';
import { isAbsolute, join, sep, win32 } from 'node:path';
import { ErrorStatus } from '../error/enums/error-status';
import { IOError } from '../error/io-error';
import type { IOsType } from '../interface/i-os-type';

export class PathService {
	private osType: IOsType;
	public constructor(osType: IOsType) {
		this.osType = osType;
	}

	/**
	 * Verifica se um diretório existe.
	 * @param path - O caminho do diretório a ser verificado.
	 * @returns Uma Promise que resolve para true se o diretório existir, false caso contrário.
	 */
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

	/**
	 * Combina um array de caminhos em um único caminho absoluto.
	 * @param paths - O array de caminhos a serem combinados.
	 * @returns O caminho absoluto resultante.
	 */
	public safeJoin(paths: Array<string>): string {
		if (!paths || paths.length === 0) {
			throw new IOError({
				name: ErrorStatus.DIRECTORY_NOT_FOUND,
				message: 'Directory not found',
			});
		}

		const isWindows: string =
			this.osType.getOsPlatform() === 'win32' ? win32.sep : sep;
		const joinPath: string = join(...paths);

		const pathAbsolute: string = joinPath.split(isWindows).join(isWindows);
		if (pathAbsolute === '') {
			throw new IOError({
				name: ErrorStatus.DIRECTORY_NOT_ABSOLUTE,
				message: 'Directory not absolute',
			});
		}

		return pathAbsolute;
	}
}
