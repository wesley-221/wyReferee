import { ModBracket } from "./mod-bracket";
import { ModBracketMap } from "./mod-bracket-map";
import { Gamemodes } from "../osu-models/osu";

export class Mappool {
	id: number = null;
	name: string;
	modBrackets: ModBracket[] = [];
	modifiers: {} = {};
	allBeatmaps: any[] = [];
	gamemodeId: Gamemodes = Gamemodes.Osu;
	publishId: number;
	updateAvailable: boolean = false;

	constructor() { }

    /**
     * Get all the mod brackets
     */
	public getAllBrackets() {
		return this.modBrackets;
	}

    /**
     * Add a modbracket to the mappool
     * @param modBracket the modbracket to add
     */
	public addBracket(modBracket: ModBracket) {
		this.modBrackets.push(modBracket);
	}

	/**
	 * Get a modbracket by the given id
	 * @param modBracketId the id of the bracket
	 */
	public getModBracketByid(modBracketId: number) {
		for (let bracket in this.modBrackets) {
			if (this.modBrackets[bracket].id == modBracketId) {
				return this.modBrackets[bracket];
			}
		}

		return null;
	}

    /**
     * Convert the mappool object to json format
     */
	public convertToJson(): any {
		let mappool = {
			id: this.id,
			name: this.name,
			brackets: [],
			modifiers: {},
			gamemode: this.gamemodeId,
			publishId: this.publishId
		};

		for (let bracket in this.modBrackets) {
			const thisBracket = this.modBrackets[bracket];

			let newBracket = {
				id: (thisBracket.id == null) ? parseInt(bracket) : thisBracket.id,
				bracketName: thisBracket.bracketName,
				mods: JSON.stringify(thisBracket.mods),
				beatmaps: []
			};

			for (let map in thisBracket.beatmaps) {
				const thisMap = thisBracket.beatmaps[map];
				if (thisMap.beatmapId == null) continue;

				newBracket.beatmaps.push({
					id: thisMap.id,
					beatmapId: thisMap.beatmapId,
					beatmapName: thisMap.beatmapName,
					beatmapUrl: thisMap.beatmapUrl,
					modifier: thisMap.modifier,
					gamemode: this.gamemodeId
				});
			}

			mappool.brackets.push(newBracket);
		}

		return mappool;
	}

    /**
     * Make a true copy of the given mappool
     * @param mappool the mappool
     */
	public static makeTrueCopy(mappool: Mappool): Mappool {
		const newMappool = new Mappool();

		newMappool.id = mappool.id;
		newMappool.name = mappool.name;

		for (let bracket in mappool.modBrackets) {
			newMappool.modBrackets.push(ModBracket.makeTrueCopy(mappool.modBrackets[bracket]));
		}

		newMappool.modifiers = mappool.modifiers;
		newMappool.gamemodeId = mappool.gamemodeId;
		newMappool.publishId = mappool.publishId;

		return newMappool;
	}

    /**
     * Serialize the json so that it gives back a mappool object
     * @param json the json to serialize
     */
	public static serializeJson(json: any): Mappool {
		const thisMappool = json,
			newMappool = new Mappool();

		newMappool.id = thisMappool.id
		newMappool.name = thisMappool.name;
		newMappool.gamemodeId = thisMappool.gamemode;
		newMappool.publishId = thisMappool.publishId;

		// Loop through all the brackets in the current mappool
		for (let bracket in thisMappool.brackets) {
			const thisBracket = thisMappool.brackets[bracket],
				newBracket = new ModBracket();

			newBracket.id = thisBracket.id;
			newBracket.mods = JSON.parse(thisBracket.mods);
			newBracket.bracketName = thisBracket.bracketName;

			// Loop through all the beatmaps in the current bracket
			for (let beatmap in thisBracket.beatmaps) {
				const newBeatmap = new ModBracketMap();

				newBeatmap.id = thisBracket.beatmaps[beatmap].id;
				newBeatmap.beatmapId = thisBracket.beatmaps[beatmap].beatmapId;
				newBeatmap.beatmapName = thisBracket.beatmaps[beatmap].beatmapName;
				newBeatmap.beatmapUrl = thisBracket.beatmaps[beatmap].beatmapUrl;
				newBeatmap.modifier = thisBracket.beatmaps[beatmap].modifier;
				newBeatmap.gamemodeId = thisBracket.beatmaps[beatmap].gamemode;
				newBeatmap.invalid = false;

				newBracket.addBeatmap(newBeatmap);

				newMappool.modifiers[newBeatmap.beatmapId] = newBeatmap;

				newMappool.allBeatmaps.push({
					beatmapId: newBeatmap.beatmapId,
					name: newMappool.modifiers[newBeatmap.beatmapId].beatmapName,
					mod: thisBracket.mods
				});
			}

			newMappool.addBracket(newBracket);
		}

		return newMappool;
	}
}
