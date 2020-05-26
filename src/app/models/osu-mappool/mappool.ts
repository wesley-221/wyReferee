import { ModBracket } from "./mod-bracket";
import { ModBracketMap } from "./mod-bracket-map";
import { Gamemodes } from "../osu-models/osu";
import { User } from "../authentication/user";

export enum Availability {
	ToEveryone = 0,
	ToMe = 1,
	ToSpecificPeople = 2
}

export class Mappool {
	id: number = null;
	name: string;
	gamemodeId: Gamemodes = Gamemodes.Osu;
	publishId: number;
	updateAvailable: boolean = false;
	availability: Availability = Availability.ToEveryone;
	availableTo: number[] = [];
	modBrackets: ModBracket[] = [];
	modifiers: {} = {};
	allBeatmaps: any[] = [];

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
	 * Allow the user to view the mappool
	 * @param userId
	 */
	public addUser(userId: number) {
		this.availableTo.push(userId);
	}

	/**
	 * Remove the permissions for the user to view the mappool
	 * @param user
	 */
	public removeUser(userId: number) {
		for (let i in this.availableTo) {
			if (this.availableTo[i] == userId) {
				this.availableTo.splice(Number(i), 1);
				return true;
			}
		}

		return false;
	}

	/**
	 * Compare the current mappool with the given mappool
	 * @param mappool the mappool to compare with
	 */
	public comapreTo(mappool: Mappool) {
		if ((
			this.name == mappool.name &&
			this.gamemodeId == mappool.gamemodeId &&
			this.modBrackets.length == mappool.modBrackets.length &&
			Object.keys(this.modifiers).length == Object.keys(mappool.modifiers).length &&
			this.availability == mappool.availability
		) == false) {
			return false;
		}

		for (let modifier in this.modifiers) {
			if (this.modifiers[modifier].compareTo(mappool.modifiers[modifier]) == false) {
				return false;
			}
		}

		for (let bracket in this.modBrackets) {
			if (this.modBrackets[bracket].compareTo(mappool.modBrackets[bracket]) == false) {
				return false;
			}
		}

		return true;
	}

    /**
     * Convert the mappool object to json format
	 * @param publish
     */
	public convertToJson(): any {
		let mappool = {
			id: this.id,
			name: this.name,
			gamemodeId: this.gamemodeId,
			publishId: this.publishId,
			availability: this.availability,
			availableTo: [],
			modBrackets: [],
			modifiers: {}
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

			mappool.modBrackets.push(newBracket);
		}

		for (let user in this.availableTo) {
			mappool.availableTo.push(this.availableTo[user]);
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
		newMappool.gamemodeId = mappool.gamemodeId;
		newMappool.publishId = mappool.publishId;
		newMappool.availability = mappool.availability;
		newMappool.modifiers = mappool.modifiers;

		for (let bracket in mappool.modBrackets) {
			newMappool.modBrackets.push(ModBracket.makeTrueCopy(mappool.modBrackets[bracket]));
		}

		for (let user in mappool.availableTo) {
			newMappool.availableTo.push(mappool.availableTo[user]);
		}

		return newMappool;
	}

    /**
     * Serialize the json so that it gives back a mappool object
     * @param json the json to serialize
     */
	public static serializeJson(json: any): Mappool {
		const newMappool = new Mappool();

		newMappool.id = json.id;
		newMappool.name = json.name;
		newMappool.gamemodeId = json.gamemodeId;
		newMappool.publishId = json.id;
		newMappool.availability = json.availability;

		// Loop through all the brackets in the current mappool
		for (let bracket in json.modBrackets) {
			const thisBracket = json.modBrackets[bracket],
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

				newMappool.modifiers[newBeatmap.beatmapId] = newBeatmap;

				newMappool.allBeatmaps.push({
					beatmapId: newBeatmap.beatmapId,
					mod: thisBracket.mods,
					name: newBeatmap.beatmapName
				});

				newBracket.addBeatmap(newBeatmap);
			}

			newMappool.addBracket(newBracket);
		}

		for (let user in json.availableTo) {
			newMappool.availableTo.push(json.availableTo[user]);
		}

		return newMappool;
	}
}
