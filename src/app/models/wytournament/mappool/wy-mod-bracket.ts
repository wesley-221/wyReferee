import { Lobby } from 'app/models/lobby';
import { WyMod } from './wy-mod';
import { WyModBracketMap } from './wy-mod-bracket-map';

export class WyModBracket {
	id: number;
	name: string;
	acronym: string;
	mods: WyMod[];
	beatmaps: WyModBracketMap[];
	collapsed: boolean;
	index: number;
	modIndex: number;
	beatmapIndex: number;

	constructor(init?: Partial<WyModBracket>) {
		this.mods = [];
		this.beatmaps = [];

		Object.assign(this, init);
	}

	/**
	 * Create a true copy of the object
	 *
	 * @param mod the object to copy
	 */
	public static makeTrueCopy(modBracket: WyModBracket): WyModBracket {
		const newModBracket = new WyModBracket({
			id: modBracket.id,
			name: modBracket.name,
			acronym: modBracket.acronym,
			collapsed: modBracket.collapsed,
			index: modBracket.index,
			modIndex: 0,
			beatmapIndex: 0
		});

		for (const beatmap in modBracket.beatmaps) {
			const newBeatmap = WyModBracketMap.makeTrueCopy(modBracket.beatmaps[beatmap]);

			newBeatmap.index = newModBracket.beatmapIndex;
			newModBracket.beatmapIndex++;

			newModBracket.beatmaps.push(newBeatmap);
		}

		for (const mod in modBracket.mods) {
			const newMod = WyMod.makeTrueCopy(modBracket.mods[mod]);

			newMod.index = newModBracket.modIndex;
			newModBracket.modIndex++;

			newModBracket.mods.push(newMod);
		}

		return newModBracket;
	}

	/**
	 * Pick a random map from the current bracket with the data from the given multiplayer lobby
	 *
	 * @param multiplayerLobby the multiplayerlobby to get the data from
	 */
	pickRandomMap(multiplayerLobby: Lobby): WyModBracketMap {
		let randomMap: WyModBracketMap = null;

		let iterations = 0;

		do {
			const map = this.beatmaps[Math.floor(Math.random() * this.beatmaps.length)];

			if (!multiplayerLobby.beatmapIsBanned(map.beatmapId) && !multiplayerLobby.beatmapIsPicked(map.beatmapId)) {
				randomMap = map;
			}

			iterations++;
		}
		while (randomMap == null && iterations < 30);

		return randomMap;
	}
}
