import { ModBracketMap } from './mod-bracket-map';
import { OsuHelper } from '../osu-models/osu';

export class ModBracket {
	id: number;
	bracketName: string;
	mods: any[] = [];
	beatmaps: ModBracketMap[] = [];
	collapsed = false; // Used for showing/hiding the body when creating a bracket
	validateIndex: number = 0;

	getBeatmaps() {
		return this.beatmaps;
	}

    /**
     * Add a beatmap to the mod bracket
     * @param map the map to add to the bracket
     */
	public addBeatmap(map: ModBracketMap) {
		this.beatmaps.push(map);
	}

    /**
     * Remove a map from the bracket
     * @param map the map to remove from the bracket
     */
	public removeMap(map: ModBracketMap) {
		this.beatmaps.splice(this.beatmaps.indexOf(map), 1);
	}

	/**
	 * Get a list with the mods from the bracket
	 */
	public getFullMods(): string[] {
		let modBit = 0;
		let freemodEnabled = false;
		let mods = [];

		for (const mod in this.mods) {
			if (!isNaN(this.mods[mod].modValue)) {
				modBit += Number(this.mods[mod].modValue);
			}
			else if (this.mods[mod].modValue == 'freemod') {
				freemodEnabled = true;
			}
		}

		mods = OsuHelper.getModsFromBit(modBit);

		// Check if freemod is enabled
		if (freemodEnabled)
			mods.push('freemod');

		return mods;
	}

	/**
	 * Compare the current modbracket with the given modbracket
	 * @param modBracket the modbracket to compare with
	 */
	public compareTo(modBracket: ModBracket) {
		if ((this.bracketName == modBracket.bracketName && this.mods.length == modBracket.mods.length && this.beatmaps.length == modBracket.beatmaps.length) == false) {
			return false;
		}

		for (const mod in this.mods) {
			if (this.mods[mod].modValue != modBracket.mods[mod].modValue) {
				return false;
			}
		}

		for (const map in this.beatmaps) {
			if (this.beatmaps[map].compareTo(modBracket.beatmaps[map]) == false) {
				return false;
			}
		}

		return true;
	}

    /**
     * Make a true copy of the given bracket
     * @param bracket the bracket
     */
	public static makeTrueCopy(bracket: ModBracket): ModBracket {
		const newBracket = new ModBracket();

		newBracket.id = bracket.id
		newBracket.bracketName = bracket.bracketName;
		newBracket.mods = bracket.mods

		// Make true copies of the beatmaps
		for (const beatmap in bracket.beatmaps) {
			newBracket.beatmaps.push(ModBracketMap.makeTrueCopy(bracket.beatmaps[beatmap]));
		}

		newBracket.collapsed = bracket.collapsed

		return newBracket;
	}

	/**
     * Convert the object to a json format
	 * @param bracket
     */
	public static convertToJson(bracket: ModBracket): any {
		const modBracket = {
			id: bracket.id,
			bracketName: bracket.bracketName,
			mods: JSON.stringify(bracket.mods),
			beatmaps: []
		};

		for (const map in bracket.beatmaps) {
			const thisMap = ModBracketMap.convertToJson(bracket.beatmaps[map]);
			modBracket.beatmaps.push(thisMap);
		}

		return modBracket;
	}

	public static serializeJson(json: any): ModBracket {
		const newBracket = new ModBracket();

		newBracket.id = json.id;
		newBracket.mods = JSON.parse(json.mods);
		newBracket.bracketName = json.bracketName;

		for (const beatmap in json.beatmaps) {
			newBracket.beatmaps.push(ModBracketMap.serializeJson(json.beatmaps[beatmap]));
		}

		return newBracket;
	}
}
