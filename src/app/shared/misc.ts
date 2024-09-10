export class Misc {
	/**
	 * Split the string
	 *
	 * @param nStr the string to split
	 * @param splitter the character to split the string with
	 */
	public static addDot(nStr: string | number, splitter: string) {
		nStr = nStr.toString();
		const x = nStr.split('.');
		let x1: string = x[0];
		const x2 = x.length > 1 ? `.${x[1]}` : '';
		const rgx = /(\d+)(\d{3})/;

		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, `$1${splitter}$2`);
		}

		return x1 + x2;
	}
}
