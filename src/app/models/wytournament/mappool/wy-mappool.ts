import { Gamemodes } from 'app/models/osu-models/osu';
import { WyModBracket } from './wy-mod-bracket';
import { WyModCategory } from './wy-mod-category';

export enum Availability {
	ToEveryone = 0,
	ToMe = 1,
	ToSpecificPeople = 2
}

export enum MappoolType {
	Normal = 0,
	AxS = 1,
	MysteryTournament = 2,
	RNGTournament = 3
}

export class WyMappool {
	id: number;
	publishId: number;
	index: number;
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
	 * Get a regex to match HD1/DT3/etc. from the mappool
	 * @param fullRegex true = NM1 // false = NM 1 (separated)
	 */
	getModbracketRegex(fullRegex = false): RegExp {
		const regexOptions: string[] = [];

		for (const modBracket of this.modBrackets) {
			if (modBracket.acronym) {
				if (fullRegex == true) {
					regexOptions.push(`(${modBracket.acronym}\\s?[1-${modBracket.beatmaps.length}])`);
				}
				else {
					regexOptions.push(`(${modBracket.acronym})\\s?([1-${modBracket.beatmaps.length}])`);
				}
			}
		}

		return RegExp(`(?:${regexOptions.join('|')})+`, 'gi');
	}

	/**
	 * Get information about a beatmap from the given acronym
	 * @param acronym the acronym to get the information for
	 */
	getInformationFromPickAcronym(acronym: string): { mappool: WyMappool, modBracket: WyModBracket, beatmapId: number } {
		const regexp = this.getModbracketRegex();
		const regex = regexp.exec(acronym).filter(s => s != undefined && s.trim());

		const modBracketAcronym = regex[1];
		const modBracketAcronymIndex = regex[2];

		for (const modBracket of this.modBrackets) {
			if (modBracket.acronym.toLowerCase() == modBracketAcronym.toLowerCase()) {
				return {
					mappool: this,
					modBracket: modBracket,
					beatmapId: modBracket.beatmaps[parseInt(modBracketAcronymIndex) - 1].beatmapId
				}
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
