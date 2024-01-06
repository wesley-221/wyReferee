export class ValidationError {
	validationRegex: string;
	validationErrorMessage: string;

	constructor(validationRegex: string, validationErrorMessage: string) {
		this.validationRegex = validationRegex;
		this.validationErrorMessage = validationErrorMessage;
	}

	/**
	 * Check whether the key matches the regex
	 *
	 * @param validatorKey the key to match
	 */
	match(validatorKey: string): boolean {
		const regExp = new RegExp(this.validationRegex);
		return regExp.test(validatorKey);
	}

	/**
	 * Parse the error message
	 *
	 * @param validatorKey the key that is being parsed
	 */
	parseErrorMessage(validatorKey: string): string {
		const regExp = new RegExp(this.validationRegex);
		const regex = regExp.exec(validatorKey);

		const regexValues = {};

		for (const regexKey in regex) {
			if (parseInt(regexKey) != 0 && !isNaN(parseInt(regexKey))) {
				regexValues[parseInt(regexKey) - 1] = parseInt(regex[regexKey]) + 1;
			}
		}

		const parsedMessage = this.validationErrorMessage.replace(/\{(\d+)\}/g, (_, index) => {
			const replacementValue = regexValues[index];
			return this.getOrdinal(replacementValue);
		});

		return parsedMessage;
	}

	/**
	 * Convert a number to its ordinal representation
	 *
	 * @param numberValue the number to convert
	 */
	private getOrdinal(numberValue: number): string {
		const suffixes = ['th', 'st', 'nd', 'rd'];
		const lastDigit = numberValue % 10;
		const suffix = lastDigit <= 3 && numberValue !== 11 && numberValue !== 12 && numberValue !== 13 ? suffixes[lastDigit] : suffixes[0];

		return `${numberValue}${suffix}`;
	}
}
