import type { Logger } from 'winston';
import { createLogger, format, transports } from 'winston';
import { DateFormatter } from './date-formatter';

const { combine, timestamp, printf, colorize } = format;

export class Log {
	private static date: DateFormatter = new DateFormatter();
	constructor() {}

	public static logger(): Logger {
		return createLogger({
			level: 'info',
			format: combine(
				timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				format.errors({ stack: true }),
				printf(({ level, message, timestamp, stack }) => {
					if (stack) {
						return `${timestamp} [${level}]: ${message}\n${stack}`;
					}
					return `${timestamp} [${level}]: ${message}`;
				})
			),
			transports: [
				new transports.Console({
					format: combine(
						colorize(),
						printf(({ level, message, timestamp, stack }) => {
							if (stack) {
								return `${timestamp} [${level}]: ${message}\n${stack}`;
							}
							return `${timestamp} [${level}]: ${message}`;
						})
					),
				}),
				new transports.File({
					filename: `logs/error_${Log.date.formatDate(new Date())}.log`,
					level: 'error',
				}),
				new transports.File({
					filename: `logs/warns_${Log.date.formatDate(new Date())}.log`,
					level: 'warn',
				}),
				new transports.File({
					filename: `logs/combined_${Log.date.formatDate(new Date())}.log`,
				}),
			],
		});
	}
}
