/**
 * @file src/app.ts
 * @description Main application file that initializes the server and handles file operations.
 * @license MIT
 * @author Carlos Eduardo
 * @version 1.0.0
 */

import { IOError } from './error/io-error';
import type { ICompressionService } from './interface/i-compression-service';
import type { IFileService } from './interface/i-file-service';
import { OsType } from './model/os-type';
import { PathFile } from './model/path-file';
import { PathRegistry } from './repository/path-registry';
import { CheckPlatformService } from './services/check-platform-service';
import { CompressionFileService } from './services/compression-file-service';
import { FileService } from './services/file-service';
import { PathService } from './services/path-service';
import { ArchiveOldFilesUseCase } from './use-cases/archive-old-files-use-case';

async function main(): Promise<void> {
	// Setup Services (Injeção de dependência na Raíz)
	const osType = new OsType();
	const fileService: IFileService = new FileService();
	const compressionService: ICompressionService = new CompressionFileService(
		fileService
	);
	const checkPlatformService = new CheckPlatformService();
	const pathService = new PathService(checkPlatformService);
	const pathRegistry = new PathRegistry();

	// Configuração inicial de Estado ("Downloads" na HomeDir)
	const osHomedir = osType.getOsHomedir();
	const downloadsAbsolutePath = pathService.safeJoin([osHomedir, 'Downloads']);
	const initialPathFile = new PathFile(downloadsAbsolutePath);
	pathRegistry.addPathFile(initialPathFile);

	// Iniciar a aplicação conectando dependências usando DIP
	const archiveUseCase = new ArchiveOldFilesUseCase(
		pathRegistry,
		pathService,
		fileService,
		compressionService
	);

	await archiveUseCase.execute();
}

main().catch(err => {
	if (err instanceof IOError) {
		console.error(err.name, err.message);
	} else if (err instanceof Error) {
		console.error(err.name, err.message);
	} else {
		console.error(err);
	}
});
