import { Gamemodes } from "../osu-models/osu";
import { ModCategory } from "./mod-category";

export class ModBracketMap {
	id: number = null;
	invalid: boolean = false;
	beatmapId: number = null;
	beatmapName: string = null;
	beatmapUrl: string = null;
	modifier: number = null;
	gamemodeId: Gamemodes = Gamemodes.Osu;
	modCategory: ModCategory = null;
	picked: boolean = false;

	/**
	 * Compare the current modbracketmap with the given modbracketmap
	 * @param modBracketMap the modbracketmap to compare with
	 */
	public compareTo(modBracketMap: ModBracketMap) {
		return (
			this.beatmapId == modBracketMap.beatmapId &&
			this.beatmapName == modBracketMap.beatmapName &&
			this.beatmapUrl == modBracketMap.beatmapUrl &&
			this.modifier == modBracketMap.modifier &&
			this.modCategory == modBracketMap.modCategory
		);
	}

	/**
     * Convert the object to a json format
	 * @param modBracketMap
     */
	public static convertToJson(modBracketMap: ModBracketMap): any {
		return {
			id: modBracketMap.id,
			beatmapId: modBracketMap.beatmapId,
			beatmapName: modBracketMap.beatmapName,
			beatmapUrl: modBracketMap.beatmapUrl,
			modifier: modBracketMap.modifier,
			gamemode: modBracketMap.gamemodeId,
			modCategory: (modBracketMap.modCategory != null) ? ModCategory.convertToJson(modBracketMap.modCategory) : null,
			picked: modBracketMap.picked
		}
	}

	/**
	 * Serialize the json so that it gives back a modbracketmap object
	 * @param json the json to serialize
	 */
	public static serializeJson(json: any): ModBracketMap {
		const newModBracketMap = new ModBracketMap();

		newModBracketMap.id = json.id;
		newModBracketMap.invalid = false;
		newModBracketMap.beatmapId = json.beatmapId;
		newModBracketMap.beatmapName = json.beatmapName;
		newModBracketMap.beatmapUrl = json.beatmapUrl;
		newModBracketMap.modifier = json.modifier;
		newModBracketMap.gamemodeId = json.gamemodeId;
		newModBracketMap.modCategory = json.modCategory;
		newModBracketMap.picked = json.picked;

		return newModBracketMap;
	}

    /**
     * Make a true copy of the given bracketmap
     * @param bracketMap the bracketmap
     */
	public static makeTrueCopy(bracketMap: ModBracketMap): ModBracketMap {
		const newModBracketMap = new ModBracketMap();

		newModBracketMap.id = bracketMap.id;
		newModBracketMap.invalid = bracketMap.invalid;
		newModBracketMap.beatmapId = bracketMap.beatmapId;
		newModBracketMap.beatmapName = bracketMap.beatmapName;
		newModBracketMap.beatmapUrl = bracketMap.beatmapUrl;
		newModBracketMap.modifier = bracketMap.modifier;
		newModBracketMap.gamemodeId = bracketMap.gamemodeId;
		newModBracketMap.modCategory = bracketMap.modCategory;
		newModBracketMap.picked = bracketMap.picked;

		return newModBracketMap;
	}
}
