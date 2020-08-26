import { ModBracket } from './mod-bracket';
import { ModBracketMap } from './mod-bracket-map';
import { Gamemodes } from '../osu-models/osu';
import { User } from '../authentication/user';
import { ModCategory } from './mod-category';

export enum Availability {
	ToEveryone = 0,
	ToMe = 1,
	ToSpecificPeople = 2
}

export enum MappoolType {
	Normal = 0,
	AxS = 1,
	MysteryTournament = 2
}

export class Mappool {
	id: number = null;
	name: string;
	gamemodeId: Gamemodes = Gamemodes.Osu;
	publishId: number;
	updateAvailable = false;
	availability: Availability = Availability.ToEveryone;
	mappoolType: MappoolType = MappoolType.Normal;
	availableTo: User[] = [];
	modBrackets: ModBracket[] = [];
	modifiers: {} = {};
	allBeatmaps: any[] = [];
	modCategories: ModCategory[] = [];

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
		for (const bracket in this.modBrackets) {
			if (this.modBrackets[bracket].id == modBracketId) {
				return this.modBrackets[bracket];
			}
		}

		return null;
	}

	/**
	 * Allow the user to view the mappool
	 * @param user
	 */
	public addUser(user: User) {
		this.availableTo.push(user);
	}

	/**
	 * Remove the permissions for the user to view the mappool
	 * @param user
	 */
	public removeUser(user: User) {
		this.availableTo.splice(this.availableTo.indexOf(user), 1);
	}

	/**
	 * Add a mod category to the mappool
	 * @param category
	 */
	public addModCategory(category: ModCategory) {
		this.modCategories.push(category);
	}

	/**
	 * Remove a mod category from the mappool
	 * @param category
	 */
	public removeModCategory(category: ModCategory) {
		this.modCategories.splice(this.modCategories.indexOf(category), 1);
	}

	/**
	 * Remove a mod bracket from the mappool
	 * @param modBracket
	 */
	public removeModBracket(modBracket: ModBracket) {
		this.modBrackets.splice(this.modBrackets.indexOf(modBracket), 1);
	}

	/**
	 * Get a mod category from the given name
	 * @param categoryName
	 */
	public getModCategoryByName(categoryName: string) {
		for (const modCategory in this.modCategories) {
			if (this.modCategories[modCategory].categoryName == categoryName) {
				return this.modCategories[modCategory];
			}
		}
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
			this.availability == mappool.availability &&
			this.mappoolType == mappool.mappoolType &&
			this.modCategories.length == mappool.modCategories.length
		) == false) {
			return false;
		}

		for (const modifier in this.modifiers) {
			if (this.modifiers[modifier].compareTo(mappool.modifiers[modifier]) == false) {
				return false;
			}
		}

		for (const bracket in this.modBrackets) {
			if (this.modBrackets[bracket].compareTo(mappool.modBrackets[bracket]) == false) {
				return false;
			}
		}

		for (const modCategory in this.modCategories) {
			if (this.modCategories[modCategory].compareTo(mappool.modCategories[modCategory]) == false) {
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
		const mappool = {
			id: this.id,
			name: this.name,
			gamemodeId: this.gamemodeId,
			publishId: this.publishId,
			availability: this.availability,
			mappoolType: this.mappoolType,
			availableTo: [],
			modBrackets: [],
			modCategories: [],
			modifiers: {}
		};

		for (const bracket in this.modBrackets) {
			const thisBracket = this.modBrackets[bracket];

			const newBracket = {
				id: (thisBracket.id == null) ? parseInt(bracket) : thisBracket.id,
				bracketName: thisBracket.bracketName,
				mods: JSON.stringify(thisBracket.mods),
				beatmaps: []
			};

			for (const map in thisBracket.beatmaps) {
				const thisMap = thisBracket.beatmaps[map];
				if (thisMap.beatmapId == null) continue;

				newBracket.beatmaps.push({
					id: thisMap.id,
					beatmapId: thisMap.beatmapId,
					beatmapsetId: thisMap.beatmapsetId,
					beatmapName: thisMap.beatmapName,
					beatmapUrl: thisMap.beatmapUrl,
					modifier: thisMap.modifier,
					gamemode: this.gamemodeId,
					modCategory: (thisMap.modCategory != null) ? ModCategory.convertToJson(thisMap.modCategory) : null,
					picked: thisMap.picked
				});
			}

			mappool.modBrackets.push(newBracket);
		}

		for (const modCategory in this.modCategories) {
			mappool.modCategories.push(ModCategory.convertToJson(this.modCategories[modCategory]));
		}

		for (const user in this.availableTo) {
			mappool.availableTo.push(User.convertToJson(this.availableTo[user]));
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
		newMappool.mappoolType = mappool.mappoolType;
		newMappool.modifiers = mappool.modifiers;

		for (const bracket in mappool.modBrackets) {
			newMappool.modBrackets.push(ModBracket.makeTrueCopy(mappool.modBrackets[bracket]));
		}

		for (const user in mappool.availableTo) {
			newMappool.availableTo.push(User.makeTrueCopy(mappool.availableTo[user]));
		}

		for (const modCategory in mappool.modCategories) {
			newMappool.modCategories.push(ModCategory.makeTrueCopy(mappool.modCategories[modCategory]));
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
		newMappool.publishId = json.publishId;
		newMappool.availability = json.availability;
		newMappool.mappoolType = json.mappoolType;

		// Loop through all the brackets in the current mappool
		for (const bracket in json.modBrackets) {
			const thisBracket = json.modBrackets[bracket];
			const newBracket = new ModBracket();

			newBracket.id = thisBracket.id;
			newBracket.mods = JSON.parse(thisBracket.mods);
			newBracket.bracketName = thisBracket.bracketName;

			// Loop through all the beatmaps in the current bracket
			for (const beatmap in thisBracket.beatmaps) {
				const newBeatmap = new ModBracketMap();

				newBeatmap.id = thisBracket.beatmaps[beatmap].id;
				newBeatmap.beatmapId = thisBracket.beatmaps[beatmap].beatmapId;
				newBeatmap.beatmapsetId = thisBracket.beatmaps[beatmap].beatmapsetId;
				newBeatmap.beatmapName = thisBracket.beatmaps[beatmap].beatmapName;
				newBeatmap.beatmapUrl = thisBracket.beatmaps[beatmap].beatmapUrl;
				newBeatmap.modifier = thisBracket.beatmaps[beatmap].modifier;
				newBeatmap.gamemodeId = thisBracket.beatmaps[beatmap].gamemode;
				newBeatmap.picked = thisBracket.beatmaps[beatmap].picked;

				if (thisBracket.beatmaps[beatmap].modCategory != null) {
					newBeatmap.modCategory = ModCategory.serializeJson(thisBracket.beatmaps[beatmap].modCategory);
				}

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

		for (const user in json.availableTo) {
			newMappool.availableTo.push(User.serializeJson(json.availableTo[user]));
		}

		for (const modCategory in json.modCategories) {
			newMappool.modCategories.push(ModCategory.serializeJson(json.modCategories[modCategory]));
		}

		return newMappool;
	}
}
