import { MultiplayerData } from './multiplayer-data';
import { MultiplayerDataUser } from './multiplayer-data-user';
import { Mappool } from '../osu-mappool/mappool';
import { ModBracket } from '../osu-mappool/mod-bracket';
import { ModCategory } from '../osu-mappool/mod-category';

export class MultiplayerLobby {
	lobbyId: number;
	description: string;
	multiplayerLink: string;
	tournamentAcronym: string;
	teamOneName: string;
	teamTwoName: string;
	teamOneScore = 0;
	teamTwoScore = 0;
	teamSize: number;
	webhook: string;
	mappool: Mappool = null;
	mappoolId: number = null;
	ircChannel: string;
	ircConnected = false;
	scoreInterfaceIndentifier: string;

	pickedCategories: { modBracketName: string, categories: string[] }[] = [];

	firstPick: string;
	bestOf: number;

	teamOneBans: number[] = [];
	teamTwoBans: number[] = [];

	mapsCountTowardScore: {} = {};
	multiplayerData: MultiplayerData[];

	teamOneSlotArray: number[] = [];
	teamTwoSlotArray: number[] = [];

	constructor() {
		this.multiplayerData = [];
	}

	existMpData(multiplayerData: MultiplayerData): boolean {
		for (const mpData in this.multiplayerData)
			if (this.multiplayerData[mpData].game_id == multiplayerData.game_id) {
				return true;
			}

		return false;
	}

	updateMpData(multiplayerData: MultiplayerData): void {
		for (const mpData in this.multiplayerData) {
			if (this.multiplayerData[mpData].game_id == multiplayerData.game_id) {
				this.multiplayerData[mpData] = multiplayerData;
				return;
			}
		}
	}

	addMpData(multiplayerData: MultiplayerData) {
		this.multiplayerData.push(multiplayerData);
	}

    /**
     * Initialize the class from the given json file
     * @param json the json file we're loading from
     */
	loadFromJson(json: any) {
		this.lobbyId = json.data.lobbyId;
		this.description = json.data.description;
		this.multiplayerLink = json.data.multiplayerLink;
		this.tournamentAcronym = json.data.tournamentAcronym;
		this.teamOneName = json.data.teamOneName;
		this.teamTwoName = json.data.teamTwoName;
		this.teamSize = json.data.teamSize;
		this.webhook = json.data.webhook;
		this.mappoolId = json.data.selectedMappoolId;
		this.scoreInterfaceIndentifier = json.data.scoreInterfaceIndentifier;

		this.firstPick = json.data.firstPick;
		this.bestOf = json.data.bestOf;

		this.teamOneBans = json.data.teamOneBans;
		this.teamTwoBans = json.data.teamTwoBans;

		this.pickedCategories = json.data.pickedCategories;

		this.mapsCountTowardScore = json.countForScore;

		for (const mpData in json.multiplayerData) {
			const currentMpData = json.multiplayerData[mpData];

			const newMpData = new MultiplayerData();

			newMpData.game_id = parseInt(mpData);
			newMpData.beatmap_id = currentMpData.beatmap_id;
			newMpData.mods = currentMpData.mods;
			newMpData.team_one_score = currentMpData.team_one_score;
			newMpData.team_two_score = currentMpData.team_two_score;

			// Add team score if it counts towards the score
			if (newMpData.team_one_score > newMpData.team_two_score) {
				if (this.mapsCountTowardScore.hasOwnProperty(newMpData.game_id) && this.mapsCountTowardScore[newMpData.game_id] == true) {
					this.teamOneScore++;
				}
			}
			else {
				if (this.mapsCountTowardScore.hasOwnProperty(newMpData.game_id) && this.mapsCountTowardScore[newMpData.game_id] == true) {
					this.teamTwoScore++;
				}
			}

			for (const playerData in currentMpData) {
				if (['beatmap_id', 'mods', 'players', 'team_one_score', 'team_two_score'].indexOf(playerData) == -1) {
					const newMpDataUser = new MultiplayerDataUser();

					newMpDataUser.accuracy = currentMpData[playerData].accuracy;
					newMpDataUser.mods = currentMpData[playerData].mods;
					newMpDataUser.passed = currentMpData[playerData].passed;
					newMpDataUser.score = currentMpData[playerData].score;
					newMpDataUser.user = currentMpData[playerData].user;
					newMpDataUser.slot = parseInt(playerData);
					newMpDataUser.caption = currentMpData[playerData].caption;

					newMpData.addPlayer(newMpDataUser);
				}
			}

			this.multiplayerData.push(newMpData);
		}
	}

    /**
     * Convert a MultiplayerLobby to json file
     * @param multiplayerLobby the lobby to convert
     */
	convertToJson(multiplayerLobby: MultiplayerLobby = this): any {
		const lobby = {
			'data': {
				'lobbyId': multiplayerLobby.lobbyId,
				'description': multiplayerLobby.description,
				'multiplayerLink': multiplayerLobby.multiplayerLink,
				'tournamentAcronym': multiplayerLobby.tournamentAcronym,
				'teamOneName': multiplayerLobby.teamOneName,
				'teamTwoName': multiplayerLobby.teamTwoName,
				'teamSize': multiplayerLobby.teamSize,
				'webhook': multiplayerLobby.webhook,
				'selectedMappoolId': (multiplayerLobby.mappool == null) ? -1 : multiplayerLobby.mappool.id,
				'firstPick': multiplayerLobby.firstPick,
				'bestOf': multiplayerLobby.bestOf,
				'teamOneBans': multiplayerLobby.teamOneBans,
				'teamTwoBans': multiplayerLobby.teamTwoBans,
				'scoreInterfaceIndentifier': multiplayerLobby.scoreInterfaceIndentifier,
				'pickedCategories': multiplayerLobby.pickedCategories
			},
			'countForScore': {},
			'multiplayerData': {}
		};

		if (multiplayerLobby.mapsCountTowardScore !== undefined)
			lobby.countForScore = multiplayerLobby.mapsCountTowardScore;

		for (const match in multiplayerLobby.multiplayerData) {
			const currentMatch = multiplayerLobby.multiplayerData[match];
			lobby.multiplayerData[currentMatch.game_id] = {};
			const allPlayers = currentMatch.getPlayers();

			for (const score in allPlayers) {
				lobby.multiplayerData[currentMatch.game_id][allPlayers[score].slot] = {
					'user': allPlayers[score].user,
					'score': allPlayers[score].score,
					'accuracy': allPlayers[score].accuracy,
					'passed': allPlayers[score].passed,
					'mods': allPlayers[score].mods,
					'caption': allPlayers[score].caption
				}
			}

			lobby.multiplayerData[currentMatch.game_id].beatmap_id = currentMatch.beatmap_id;
			lobby.multiplayerData[currentMatch.game_id].team_one_score = currentMatch.team_one_score;
			lobby.multiplayerData[currentMatch.game_id].team_two_score = currentMatch.team_two_score;
			lobby.multiplayerData[currentMatch.game_id].mods = currentMatch.mods;
		}

		return lobby;
	}

	/**
	 * Get the name of the team that has to pick next
	 */
	getNextPickName() {
		const totalMapsPlayed = this.teamOneScore + this.teamTwoScore;
		let nextPick = '';

		// First pick goes to .firstPick
		if (totalMapsPlayed % 2 == 0) {
			nextPick = this.firstPick;
		}
		else {
			nextPick = this.firstPick == this.teamOneName ? this.teamTwoName : this.teamOneName;
		}

		return nextPick;
	}

	/**
	 * Check if a team is on a breakpoint
	 */
	getBreakpoint() {
		if (this.teamOneScore == Math.floor(this.bestOf / 2)) {
			return this.teamOneName
		}
		else if (this.teamTwoScore == Math.floor(this.bestOf / 2)) {
			return this.teamTwoName;
		}

		return null;
	}

	/**
	 * Check if a team has won the match
	 */
	getHasWon() {
		if (this.teamOneScore == Math.ceil(this.bestOf / 2)) {
			return this.teamOneName;
		}
		else if (this.teamOneScore == Math.ceil(this.bestOf / 2)) {
			return this.teamTwoName;
		}

		return null;
	}

	/**
	 * Mark a category as picked in a modbracket
	 * @param modBracket
	 * @param modCategory
	 */
	pickModCategoryForModBracket(modBracket: ModBracket, modCategory: ModCategory) {
		let foundBracket = 0;

		for (const mb in this.pickedCategories) {
			if (this.pickedCategories[mb].modBracketName == modBracket.bracketName) {
				this.pickedCategories[mb].categories.push(modCategory.categoryName);
				foundBracket = 1;
			}
		}

		if (foundBracket == 0) {
			this.pickedCategories.push({ modBracketName: modBracket.bracketName, categories: [modCategory.categoryName] });
		}
	}
}
