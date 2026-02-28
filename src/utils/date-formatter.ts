export class DateFormatter {
	public constructor() {}

	/**
	 * Formata um objeto Date para uma string no formato "DD-MM-YYYY".
	 * @param date - Objeto Date a ser formatado.
	 * @returns {string} String no formato "DD-MM-YYYY".
	 */
	public formatDate(date: Date): string {
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		return `${day}-${month}-${year}`;
	}

	/**
	 * Extrai a data do nome de um arquivo se ele possuir o padrão "DD-MM-YYYY".
	 * Retorna um objeto Date ou null se não houver formato válido.
	 * @param filename - Nome do arquivo a ser extraído a data.
	 * @returns {Date | null} Objeto Date ou null se não houver formato válido.
	 */
	private extractDateFromString(filename: string): Date | null {
		const regex = /(\d{2})-(\d{2})-(\d{4})/;
		const match = filename.match(regex);

		if (!match) return null;

		const day = parseInt(match[1], 10);
		const month = parseInt(match[2], 10) - 1; // O mês no Date do JS inicia no 0 (Janeiro = 0)
		const year = parseInt(match[3], 10);

		return new Date(year, month, day);
	}

	/**
	 * Verifica se a data do arquivo passado é mais antiga (anterior) do que uma data de referência.
	 * @param dateToCompare - Data do arquivo a ser comparada.
	 * @param referenceDate - Data de referência.
	 * @returns {boolean} True se a data do arquivo for mais antiga que a data de referência, false caso contrário.
	 */
	private isOlderThan(
		dateToCompare: Date,
		referenceDate: Date | number
	): boolean {
		const reference = new Date(referenceDate);
		return dateToCompare.getTime() < reference.getTime();
	}

	/**
	 * Recebe um array de nomes de arquivos e retorna somente os arquivos
	 * que possuam uma data em seu nome que seja mais antiga que a referência.
	 * @param filenames - Array de nomes de arquivos.
	 * @param referenceDate - Data de referência.
	 * @returns {string[]} Array de nomes de arquivos mais antigos que a data de referência.
	 */
	public filterFilesOlderThan(
		filenames: string[],
		referenceDate: Date | number
	): string[] {
		return filenames.filter(filename => {
			const dateInFile = this.extractDateFromString(filename);
			// Se não conseguir extrair, a gente ignora esse arquivo
			if (!dateInFile) return false;

			return this.isOlderThan(dateInFile, referenceDate);
		});
	}
}
