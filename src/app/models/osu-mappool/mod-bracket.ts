import { ModBracketMap } from "./mod-bracket-map";
import { OsuHelper } from "../osu-models/osu";

export class ModBracket {
	id: number;
	bracketName: string;
	mods: any[] = [];
	beatmaps: ModBracketMap[] = [];
	collapsed: boolean = false; // Used for showing/hiding the body when creating a bracket

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
		let modBit = 0, 
			freemodEnabled = false,
			mods = [];

		for(let mod in this.mods) {
			if(!isNaN(this.mods[mod].modValue)) {
				modBit += Number(this.mods[mod].modValue);
			}
			else if(this.mods[mod].modValue == "freemod") {
				freemodEnabled = true;
			}
		}

		mods = OsuHelper.getModsFromBit(modBit);
		
		// Check if freemod is enabled
		if(freemodEnabled) 
			mods.push("freemod");

		return mods;
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
		for (let beatmap in bracket.beatmaps) {
			newBracket.beatmaps.push(ModBracketMap.makeTrueCopy(bracket.beatmaps[beatmap]));
		}

		newBracket.collapsed = bracket.collapsed

		return newBracket;
	}
}
