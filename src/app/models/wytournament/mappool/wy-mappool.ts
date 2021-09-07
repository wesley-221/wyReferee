import { Gamemodes } from "app/models/osu-models/osu";
import { WyModBracket } from "./wy-mod-bracket";
import { WyModCategory } from "./wy-mod-category";

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

export class WyMappool {
	id: number;
	publishId: number;
	name: string;
	gamemodeId: Gamemodes;
	type: MappoolType;

	modBrackets: WyModBracket[];
	modCategories: WyModCategory[];

	modBracketIndex: number;
	modCategoryIndex: number;

	collapsed: boolean;

	constructor(init?: Partial<WyMappool>) {
		this.modBrackets = [];
		this.modCategories = [];

		this.modBracketIndex = 0;
		this.modCategoryIndex = 0;

		Object.assign(this, init);
	}

	/**
	 * Get the category by the given name
	 * @param name the name of the category
	 */
	getModCategoryByName(name: string): WyModCategory {
		for (const category in this.modCategories) {
			if (this.modCategories[category].name == name) {
				return this.modCategories[category];
			}
		}

		return null;
	}

	/**
	 * Create a true copy of the object
	 * @param mod the object to copy
	 */
	public static makeTrueCopy(mappool: WyMappool): WyMappool {
		const newMappool = new WyMappool({
			id: mappool.id,
			publishId: mappool.publishId,
			name: mappool.name,
			gamemodeId: mappool.gamemodeId,
			type: mappool.type,
			modBracketIndex: 0,
			modCategoryIndex: 0,
			collapsed: mappool.collapsed
		});

		for (const modBracket in mappool.modBrackets) {
			const newModBracket = WyModBracket.makeTrueCopy(mappool.modBrackets[modBracket]);

			newModBracket.index = newMappool.modBracketIndex;
			newMappool.modBracketIndex++;

			newMappool.modBrackets.push(newModBracket);
		}

		for (const modCategory in mappool.modCategories) {
			const newModCategory = WyModCategory.makeTrueCopy(mappool.modCategories[modCategory])
			newModCategory.index = newMappool.modCategoryIndex;

			newMappool.modCategoryIndex++;

			newMappool.modCategories.push(newModCategory);
		}

		return newMappool;
	}
}
