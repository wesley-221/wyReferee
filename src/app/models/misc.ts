export class Misc {
	public static deepEquals(o1, o2) {
		const o1keys = Object.keys(o1).sort();
		const o2keys = Object.keys(o2).sort();

		if (o1keys.join() !== o2keys.join()) {
			return false;
		}

		return o1keys.every(key => {
			const v1 = o1[key];
			const v2 = o2[key];

			if (v1 === null) {
				return v2 === null;
			}

			const t1 = typeof v1;
			const t2 = typeof v2;

			if (t1 !== t2) {
				return false;
			}

			return t1 === 'object' ? Misc.deepEquals(v1, v2) : true;
		});
	}
}
