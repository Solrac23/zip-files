// biome-ignore assist/source/organizeImports: <false>
import archiver from 'archiver';
import { join } from 'node:path';
import type { ICompressionService } from '../interface/i-compression-service';
import type { IFileService } from '../interface/i-file-service';

export class CompressionFileService implements ICompressionService {
	private fileService: IFileService;

	public constructor(fileService: IFileService) {
		this.fileService = fileService;
	}

	public async compressFiles(
		dir: string,
		files: string[],
		outputZipPath: string
	): Promise<void> {
		try {
			const output = await this.fileService.createWriteStreamForFile(
				dir,
				outputZipPath
			);
			const archive = archiver('zip', { zlib: { level: 9 } });

			output.on('error', err => {
				throw new Error(err.message);
			});

			output.on('close', () => {
				console.log(`${archive.pointer()} total bytes`);
				console.log(`Arquivos compactados em: ${dir}/${outputZipPath}`);
			});

			archive.pipe(output);
			for (const file of files) {
				const fullPath = join(dir, file);
				archive.file(fullPath, { name: file });
			}
			archive.on('warning', err => {
				if (err.code === 'ENOENT') {
					console.warn(err.message, err.data);
				} else {
					throw err;
				}
			});
			archive.on('error', err => {
				throw err;
			});
			archive.finalize();
		} catch (err) {
			console.log(err);
		}
	}
}
