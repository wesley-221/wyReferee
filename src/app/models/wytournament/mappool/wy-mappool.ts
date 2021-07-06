import { User } from "app/models/authentication/user";
import { Gamemodes } from "app/models/osu-models/osu";
import { WyModBracket } from "./wy-mod-bracket";

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
	localId: number;
	publishId: number;
	name: string;
	gamemodeId: Gamemodes;
	mappoolType: MappoolType;

	modBrackets: WyModBracket[];

	constructor(init?: Partial<WyMappool>) {
		this.modBrackets = [];

		Object.assign(this, init);
	}

	/**
	 * Create a true copy of the object
	 * @param mod the object to copy
	 */
	public static makeTrueCopy(mappool: WyMappool): WyMappool {
		const newMappool = new WyMappool({
			localId: mappool.localId,
			publishId: mappool.publishId,
			name: mappool.name,
			gamemodeId: mappool.gamemodeId,
			mappoolType: mappool.mappoolType
		});

		for (const modBracket in mappool.modBrackets) {
			newMappool.modBrackets.push(mappool.modBrackets[modBracket]);
		}

		return newMappool;
	}
}
