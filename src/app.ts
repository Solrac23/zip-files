/**
 * @file src/app.ts
 * @description Main application file that initializes the server and handles file operations.
 * @license MIT
 * @author Carlos Eduardo
 * @version 1.0.0
 */

import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { IOError } from './error/io-error';
import type { ICompressionService } from './interface/i-compression-service';
import type { IFileService } from './interface/i-file-service';
import { CompressionFileService } from './model/compression-file-service';
import { OsType } from './model/os-type';
import { PathFile } from './model/path-file';
import { CheckPlatformService } from './services/check-platform-service';
import { FileService } from './services/file-service';
import { PathService } from './services/path-service';

async function main(): Promise<void> {
	const osType = new OsType();
	const fileService: IFileService = new FileService();
	const compressionService: ICompressionService = new CompressionFileService();
	const osHomedir = osType.getOsHomedir();

	const initialPathFile = new PathFile(osHomedir, 'Downloads');
	osType.addPathFile(initialPathFile);

	const pathFileList: PathFile[] = Array.from(osType.getPathfile());

	for (const pathFile of pathFileList) {
		try {
			const way = pathFile.getPaths();

			const pathService = new PathService(new CheckPlatformService());
			const joinedPath = pathService.safeJoin(
				way as string[],
				pathService.removePaths
			);

			if (await pathService.isDirectoryExists(joinedPath)) {
				pathFile.addPaths(joinedPath);
			}

			const readFiles = await fileService.readFilesFromDirectory(joinedPath);
			pathFile.addFiles(...readFiles);

			const threeMonthosAgo: Date = new Date();
			threeMonthosAgo.setMonth(threeMonthosAgo.getMonth() - 3);
			const dir = pathFile.getPaths()[0];
			const fileNames = pathFile.getFiles();
			const filesToCompress: string[] = [];

			for (const fileName of fileNames) {
				const fullFilePath = join(dir, fileName);
				const fileStats = await stat(fullFilePath);
				const lastModified = fileStats.mtime;

				if (lastModified < threeMonthosAgo) {
					filesToCompress.push(fileName);
				} else {
					console.warn(
						`Arquivo ${fileName} nao compactado: modificado ha mais de 3 meses`
					);
				}
			}

			if (filesToCompress.length > 0) {
				const d: Date = new Date();
				const zipName = `compactado_${d.getDate()}-${d.getMonth().toString()}-${d.getFullYear()}.zip`;
				try {
					const output = await fileService.createWriteStreamForFile(
						dir,
						zipName
					);
					// await compressionService.compressFiles()
				} catch (err) {}
			}
		} catch (err) {
			console.error(err);
		}
	}
}

main().catch(err => {
	if (err instanceof IOError) {
		console.error(err.name, err.message);
	} else if (err instanceof Error) {
		console.error(err.name, err.message);
	} else {
		console.error(err.message);
	}
});
