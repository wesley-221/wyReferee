export class ValidationErrorMessage {
	validationRegex: RegExp;
	validationErrorMessage: string;

	constructor(validationRegex: RegExp, validationErrorMessage: string) {
		this.validationRegex = validationRegex;
		this.validationErrorMessage = validationErrorMessage;
	}

	/**
	 * Check whether the key matches the regex
	 */
	match(validatorKey: string): boolean {
		return this.validationRegex.test(validatorKey);
	}

	/**
	 * Parse the error message
	 */
	parseErrorMessage(validatorKey: string): string {
		const regexResult = this.validationRegex.exec(validatorKey);

		if (!regexResult) {
			return this.validationErrorMessage;
		}

		const regexValues: Record<number, number> = {};

		for (let i = 1; i < regexResult.length; i++) {
			const value = parseInt(regexResult[i], 10);

			if (!isNaN(value)) {
				regexValues[i - 1] = value + 1;
			}
		}

		return this.validationErrorMessage.replace(/\{(\d+)\}/g, (_, index) => {
			const replacementValue = regexValues[parseInt(index, 10)];
			return replacementValue ? this.getOrdinal(replacementValue) : '';
		});
	}

	/**
	 * Convert a number to its ordinal representation
	 */
	private getOrdinal(numberValue: number): string {
		const suffixes = ['th', 'st', 'nd', 'rd'];
		const lastDigit = numberValue % 10;

		const suffix =
			lastDigit <= 3 &&
				![11, 12, 13].includes(numberValue)
				? suffixes[lastDigit]
				: suffixes[0];

		return `${numberValue}${suffix}`;
	}
}
