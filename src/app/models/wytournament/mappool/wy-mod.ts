export class WyMod {
	id: number;
	name: string;

	constructor(init?: Partial<WyMod>) {
		Object.assign(this, init);
	}

	/**
	 * Create a true copy of the object
	 * @param mod the object to copy
	 */
	public static makeTrueCopy(mod: WyMod): WyMod {
		return new WyMod({
			id: mod.id,
			name: mod.name
		});
	}
}
