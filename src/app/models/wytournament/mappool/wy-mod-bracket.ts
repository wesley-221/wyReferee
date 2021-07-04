import { WyMod } from "./wy-mod";
import { WyModBracketMap } from "./wy-mod-bracket-map";

export class WyModBracket {
	id: number;
	name: string;
	mods: WyMod[];
	beatmaps: WyModBracketMap[];
	collapsed: boolean;
	validateIndex: number;

	constructor(init?: Partial<WyModBracket>) {
		this.mods = [];
		this.beatmaps = [];

		Object.assign(this, init);
	}

	/**
	 * Create a true copy of the object
	 * @param mod the object to copy
	 */
	public static makeTrueCopy(modBracket: WyModBracket): WyModBracket {
		const newModBracket = new WyModBracket({
			id: modBracket.id,
			name: modBracket.name,
			collapsed: modBracket.collapsed,
			validateIndex: modBracket.validateIndex
		});

		for (const beatmap in modBracket.beatmaps) {
			newModBracket.beatmaps.push(WyModBracketMap.makeTrueCopy(modBracket.beatmaps[beatmap]));
		}

		for (const mod in modBracket.mods) {
			newModBracket.mods.push(WyMod.makeTrueCopy(modBracket.mods[mod]));
		}

		return newModBracket;
	}
}
