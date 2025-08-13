export interface ICompressionService {
	compressFiles(
		dir: string,
		files: string[],
		outputZipPath: string
	): Promise<void>;
}
