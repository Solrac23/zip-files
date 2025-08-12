import type { WriteStream } from 'node:fs';

export interface IFileService {
	readFilesFromDirectory(dir: string): Promise<string[]>;
	createWriteStreamForFile(dir: string, fileName: string): Promise<WriteStream>;
}
