export enum OsuApiEndpoints {
	GetBeatmaps = '/api/get_beatmaps',
	GetUser = '/api/get_user',
	GetScores = '/api/get_scores',
	GetBestPerformance = '/api/get_user_best',
	GetRecentlyPlayed = '/api/get_user_recent',
	GetMultiplayer = '/api/get_match',
	GetReplayData = '/api/get_replay'
}

export enum Mods {
	None = 0,
	NoFail = 1,
	Easy = 2,
	TouchDevice = 4,
	Hidden = 8,
	HardRock = 16,
	SuddenDeath = 32,
	DoubleTime = 64,
	Relax = 128,
	HalfTime = 256,
	Nightcore = 512, // Only set along with DoubleTime. i.e: NC only gives 576
	Flashlight = 1024,
	Autoplay = 2048,
	SpunOut = 4096,
	Relax2 = 8192,    // Autopilot
	Perfect = 16384, // Only set along with SuddenDeath. i.e: PF only gives 16416
	Key4 = 32768,
	Key5 = 65536,
	Key6 = 131072,
	Key7 = 262144,
	Key8 = 524288,
	FadeIn = 1048576,
	Random = 2097152,
	Cinema = 4194304,
	Target = 8388608,
	Key9 = 16777216,
	KeyCoop = 33554432,
	Key1 = 67108864,
	Key3 = 134217728,
	Key2 = 268435456,
	ScoreV2 = 536870912,
	Mirror = 1073741824,
	// KeyMod = Key1 | Key2 | Key3 | Key4 | Key5 | Key6 | Key7 | Key8 | Key9 | KeyCoop,
	// FreeModAllowed = NoFail | Easy | Hidden | HardRock | SuddenDeath | Flashlight | FadeIn | Relax | Relax2 | SpunOut | KeyMod,
	// ScoreIncreaseMods = Hidden | HardRock | DoubleTime | Flashlight | FadeIn
}

export enum Gamemodes {
	Osu = 0,
	Taiko = 1,
	Catch = 2,
	Mania = 3
}

export class OsuApi {
	protected url = 'https://osu.ppy.sh';
	protected endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = endpoint;
	}
}

export class OsuHelper {
	/**
	 * Get the bit from the given mod strings
	 *
	 * @param mods the mods in an array
	 */
	public static getBitFromMods(mods: string[]) {
		mods = mods.map((str: string) => str.replace(/\s/g, ''));

		let bit = 0;

		for (const mod in mods) {
			for (const item in Mods) {
				if (mods[mod].toLowerCase() == item.toLowerCase()) {
					bit += parseInt(Mods[item]);
				}
			}
		}

		return bit;
	}

	/**
	 * Get all mods from the given bit
	 *
	 * @param bit the mods
	 */
	public static getModsFromBit(bit: number) {
		const allMods = [];

		for (const item in Mods) {
			if (((Mods[item] as any) & bit) > 0) {
				allMods.push(item.toLowerCase());
			}
		}

		return allMods;
	}

	/**
	 * Get the multiplayer id from the given multiplayer link
	 *
	 * @param link the multiplayer link
	 */
	public static getMultiplayerIdFromLink(link: string) {
		return link.replace('https://osu.ppy.sh/community/matches/', '');
	}

	/**
	 * Get mod abbreviations from the given mods array
	 *
	 * @param mod the mod to get the abbreviation from
	 */
	public static getModAbbreviation(mod: string): string {
		const allMods: ModAbbreviation[] = [
			new ModAbbreviation(Mods.HardRock, 'hr'),
			new ModAbbreviation(Mods.Hidden, 'hd'),
			new ModAbbreviation(Mods.DoubleTime, 'dt'),
			new ModAbbreviation(Mods.Easy, 'ez'),
			new ModAbbreviation(Mods.Flashlight, 'fl'),
			new ModAbbreviation(Mods.HalfTime, 'ht'),
			new ModAbbreviation(Mods.Nightcore, 'nc'),
			new ModAbbreviation(Mods.Relax, 'rx'),
			new ModAbbreviation(Mods.NoFail, 'nf'),
			new ModAbbreviation(Mods.Perfect, 'pf'),
			new ModAbbreviation(Mods.SuddenDeath, 'sd')
		];

		let modAbbreviations: string = null;

		for (const abbreviation of allMods) {
			if (abbreviation.fullModName.toString().toLowerCase() == mod.trim().toLowerCase()) {
				modAbbreviations = abbreviation.abbreviationModName;
			}
		}

		return modAbbreviations;
	}
}

class ModAbbreviation {
	fullModName: string;
	abbreviationModName: string;

	constructor(fullModName: Mods, abbreviationModName: string) {
		this.fullModName = Mods[fullModName];
		this.abbreviationModName = abbreviationModName;
	}
}
