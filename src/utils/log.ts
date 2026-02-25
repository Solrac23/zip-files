import type { Logger } from 'winston';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

export class Log {
	constructor() {}

	public static logger(): Logger {
		return createLogger({
			level: 'info',
			format: combine(
				timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				format.errors({ stack: true })
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
				new transports.File({ filename: 'logs/error.log', level: 'error' }),
				new transports.File({ filename: 'logs/warns.log', level: 'warn' }),
				new transports.File({ filename: 'logs/combined.log' }),
			],
		});
	}
}
