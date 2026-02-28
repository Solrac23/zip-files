/** biome-ignore-all lint/correctness/noUnusedImports: unlink */
import { readdir, unlink } from 'node:fs/promises';
import type { PlatformPath } from 'node:path';
import { posix, win32 } from 'node:path';
import type { Logger } from 'winston';
import { ErrorStatus } from '../error/enums/error-status';
import { IOError } from '../error/io-error';
import type { IOsType } from '../interface/i-os-type';
import type { DateFormatter } from '../utils/date-formatter';
import { Log } from '../utils/log';

export class RemoveOldFilesLogsUseCase {
	private readonly MONTHS_TO_KEEP: number = new Date().setMonth(
		new Date().getMonth() - 3
	);
	private logger: Logger;

	public constructor(
		private osType: IOsType,
		private dateFormatter: DateFormatter
	) {
		this.logger = Log.logger();
	}

	public async removeFilesLogs(): Promise<void> {
		try {
			const path: PlatformPath =
				this.osType.getOsPlatform() === 'win32' ? win32 : posix;
			const logPath = path.join(__dirname, '..', '..', 'logs');

			if (!logPath) {
				throw new IOError({
					name: ErrorStatus.DIRECTORY_NOT_FOUND,
					message: 'Log path not found',
					cause: logPath,
				});
			}

			const files: string[] = await readdir(logPath);

			if (!files.length) {
				throw new IOError({
					name: ErrorStatus.FILES_NOT_FOUND,
					message: 'Log path not found',
					cause: logPath,
				});
			}

			const filesOlderThanThreeMonths = this.dateFormatter.filterFilesOlderThan(
				files,
				this.MONTHS_TO_KEEP
			);

			await Promise.all(
				filesOlderThanThreeMonths.map(async file => {
					await unlink(path.join(logPath, file));
					this.logger.info(`Arquivo ${file} removido com sucesso`);
				})
			);
		} catch (err) {
			if (err instanceof IOError) {
				this.logger.error(`${err.name}: ${err.message} ${err.cause}`);
				return;
			} else if (err instanceof Error) {
				this.logger.error(`${err.name}: ${err.message} ${err.stack}`);
				return;
			}
			this.logger.error(`${err}`);
		}
	}
}
