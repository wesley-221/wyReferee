import { IrcChannel } from "./irc/irc-channel";
import { MultiplayerLobbyPlayers } from "./mutliplayer-lobby-players/multiplayer-lobby-players";
import { PickedCategory } from "./picked-category";
import { MultiplayerData } from "./store-multiplayer/multiplayer-data";
import { WyMappool } from "./wytournament/mappool/wy-mappool";
import { WyModBracket } from "./wytournament/mappool/wy-mod-bracket";
import { WyModCategory } from "./wytournament/mappool/wy-mod-category";
import { WyStage } from "./wytournament/wy-stage";
import { WyTeamPlayer } from "./wytournament/wy-team-player";
import { WyTournament } from "./wytournament/wy-tournament";

export class Lobby {
	lobbyId: number;
	description: string;
	multiplayerLink: string;

	tournamentId: number;
	tournament: WyTournament;

	teamSize: number;

	mappoolId: number;
	mappoolIndex: number;
	mappool: WyMappool;

	ircChannel: IrcChannel;

	firstPick: string;
	selectedStage: WyStage;
	bestOf: number;

	teamOneName: string;
	teamTwoName: string;

	teamOneScore: number;
	teamTwoScore: number;

	teamOneBans: number[];
	teamTwoBans: number[];

	teamOnePicks: number[];
	teamTwoPicks: number[];

	teamOneSlotArray: number[];
	teamTwoSlotArray: number[];

	gamesCountTowardsScore: {}

	multiplayerData: MultiplayerData[];
	pickedCategories: PickedCategory[];

	ircConnected: boolean;

	isQualifierLobby: boolean;
	sendWebhooks: boolean;

	multiplayerLobbyPlayers: MultiplayerLobbyPlayers;

	constructor(init?: Partial<Lobby>) {
		this.teamOneBans = [];
		this.teamTwoBans = [];

		this.teamOnePicks = [];
		this.teamTwoPicks = [];

		this.teamOneSlotArray = [];
		this.teamTwoSlotArray = [];

		this.gamesCountTowardsScore = {};

		this.multiplayerData = [];
		this.pickedCategories = [];

		this.teamOneScore = 0;
		this.teamTwoScore = 0;

		this.ircConnected = false;

		this.isQualifierLobby = false;
		this.sendWebhooks = true;

		this.multiplayerLobbyPlayers = new MultiplayerLobbyPlayers();

		Object.assign(this, init);
	}

	/**
	 * Get an array with all players of the given team name
	 * @param teamName the name of the team
	 */
	getTeamPlayersFromTournament(teamName: string): WyTeamPlayer[] {
		for (const team of this.tournament.teams) {
			if (team.name == teamName) {
				return team.players;
			}
		}

		return null;
	}

	/**
	 * Check if the multiplayer data exists in the lobby
	 * @param multiplayerData the multiplayer data to check
	 */
	doesMultiplayerDataExist(multiplayerData: MultiplayerData): boolean {
		for (const mpData of this.multiplayerData) {
			if (mpData.game_id == multiplayerData.game_id) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Update the multiplayer data in the lobby
	 * @param multiplayerData the multiplayer data to update
	 */
	updateMultiplayerData(multiplayerData: MultiplayerData): void {
		for (const mpData in this.multiplayerData) {
			if (this.multiplayerData[mpData].game_id == multiplayerData.game_id) {
				this.multiplayerData[mpData] = multiplayerData;
				return;
			}
		}
	}

	/**
	 * Add the multiplayer data to the lobby
	 * @param multiplayerData the multiplayer data to add
	 */
	addMultiplayerData(multiplayerData: MultiplayerData): void {
		this.multiplayerData.push(multiplayerData);
	}

	/**
	 * Get the name of the team that has to pick next
	 */
	getNextPick() {
		const totalMapsPlayed = this.teamOneScore + this.teamTwoScore;
		let nextPick: string = '';

		if (totalMapsPlayed % 2 == 0) {
			nextPick = this.firstPick;
		}
		else {
			nextPick = this.firstPick == this.teamOneName ? this.teamTwoName : this.teamOneName;
		}

		return nextPick;
	}

	/**
	 * Check if a team is on a matchpoint
	 */
	getMatchPoint(): string {
		if (this.teamOneScore == Math.floor(this.bestOf / 2)) {
			return this.teamOneName;
		}
		else if (this.teamTwoScore == Math.floor(this.bestOf / 2)) {
			return this.teamTwoName;
		}

		return null;
	}

	/**
	 * Check if a team has won the match
	 */
	teamHasWon(): string {
		if (this.teamOneScore == Math.ceil(this.bestOf / 2)) {
			return this.teamOneName;
		}
		else if (this.teamTwoScore == Math.ceil(this.bestOf / 2)) {
			return this.teamTwoName;
		}

		return null;
	}

	/**
	 * Get the name of the lobby
	 */
	getLobbyName(): string {
		return this.tournament != null ? `${this.tournament.acronym}: ${this.teamOneName} vs ${this.teamTwoName}` : `${this.teamOneName} vs ${this.teamTwoName}`;
	}

	/**
	 * Get the name of the lobby if it's a qualifier lobby
	 */
	getQualifierName(): string {
		return `${this.tournament.acronym}: ${this.description}`;
	}

	/**
	 * Mark a category as picked in the given mod bracket
	 * @param modBracket the mod bracket that was picked
	 * @param modCategory the mod category that was picked
	 */
	pickModCategoryFromBracket(modBracket: WyModBracket, modCategory: WyModCategory): void {
		let foundBracket = 0;

		for (const foundModBracket in this.pickedCategories) {
			if (this.pickedCategories[foundBracket].modBracketName == modBracket.name) {
				this.pickedCategories[foundModBracket].categories.push(modCategory.name);
				foundBracket = 1;

				break;
			}
		}

		if (foundBracket == 0) {
			this.pickedCategories.push(new PickedCategory({
				modBracketName: modBracket.name,
				categories: [modCategory.name]
			}));
		}
	}

	/**
	 * Get the id of the multiplayer link
	 * @param link the link to the multiplayer lobby
	 */
	static getMultiplayerIdFromLink(link: string): string {
		const regularExpression = new RegExp(/https:\/\/osu\.ppy\.sh\/community\/matches\/([0-9]+)/).exec(link);

		if (regularExpression) {
			return regularExpression[1];
		}

		return null;
	}

	/**
	 * Make a true copy of the given lobby
	 * @param lobby the lobby to make a true copy of
	 */
	public static makeTrueCopy(lobby: Lobby): Lobby {
		const newLobby = new Lobby({
			lobbyId: lobby.lobbyId,
			description: lobby.description,
			multiplayerLink: lobby.multiplayerLink,
			tournamentId: lobby.tournamentId,
			tournament: lobby.tournament != null ? WyTournament.makeTrueCopy(lobby.tournament) : null,
			teamSize: lobby.teamSize,
			mappoolId: lobby.mappoolId,
			mappool: lobby.mappool != null ? WyMappool.makeTrueCopy(lobby.mappool) : null,
			ircChannel: lobby.ircChannel,
			firstPick: lobby.firstPick,
			selectedStage: lobby.selectedStage != null ? WyStage.makeTrueCopy(lobby.selectedStage) : null,
			bestOf: lobby.bestOf,
			teamOneName: lobby.teamOneName,
			teamTwoName: lobby.teamTwoName,
			teamOneScore: lobby.teamOneScore,
			teamTwoScore: lobby.teamTwoScore,
			teamOneBans: lobby.teamOneBans,
			teamTwoBans: lobby.teamTwoBans,
			teamOnePicks: lobby.teamOnePicks,
			teamTwoPicks: lobby.teamTwoPicks,
			teamOneSlotArray: lobby.teamOneSlotArray,
			teamTwoSlotArray: lobby.teamTwoSlotArray,
			gamesCountTowardsScore: lobby.gamesCountTowardsScore,
			multiplayerLobbyPlayers: new MultiplayerLobbyPlayers(),
			isQualifierLobby: lobby.isQualifierLobby,
			sendWebhooks: lobby.sendWebhooks
		});

		for (const pickedCategory in lobby.pickedCategories) {
			newLobby.pickedCategories.push(PickedCategory.makeTrueCopy(lobby.pickedCategories[pickedCategory]));
		}

		for (const multiplayerData in lobby.multiplayerData) {
			newLobby.multiplayerData.push(MultiplayerData.makeTrueCopy(lobby.multiplayerData[multiplayerData]));
		}

		return newLobby;
	}
}
