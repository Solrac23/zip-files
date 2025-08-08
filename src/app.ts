/**
 * @file src/app.ts
 * @description Main application file that initializes the server and handles file operations.
 * @license MIT
 * @author Carlos Eduardo
 * @version 1.0.0
 */

import { IOError } from './error/io-error';
import { OsType } from './model/os-type';
import { PathFile } from './model/path-file';
import { CheckPlatformService } from './services/check-platform-service';
import { FileService } from './services/file-service';
import { PathFileService } from './services/path-file-service';

/**
 * Se o arquivo existir, preciso ler o arquivo e verificar a ultima modificação.
 * Se a ultima modificação for menor que 3 meses, compactar os arquivo.
 * Se a ultima modificação for maior que 3 meses, não compactar os arquivos.
 */

async function main(): Promise<void> {
	const osType = new OsType();
	let pathFileService: PathFileService;
	const fileService: FileService = new FileService();
	const osHomedir = osType.getOsHomedir();

	const list = osType.getPathfile().add(new PathFile(osHomedir, 'Downloads'));

	for (const path of list) {
		try {
			const way = path.getPath();

			pathFileService = new PathFileService(new CheckPlatformService());
			const join = pathFileService.safeJoin(way, pathFileService.removePaths);

			if (await pathFileService.isDirectoryExists(join)) {
				path.addPath(join);
			}
			await fileService.readFilesPath(path.getPath());
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
