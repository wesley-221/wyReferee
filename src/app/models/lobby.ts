import { MatDialog } from '@angular/material/dialog';
import { IrcPickMapSameModBracketComponent } from 'app/components/dialogs/irc-pick-map-same-mod-bracket/irc-pick-map-same-mod-bracket.component';
import { MultiplayerLobbySettingsComponent } from 'app/components/dialogs/multiplayer-lobby-settings/multiplayer-lobby-settings.component';
import { IrcService } from 'app/services/irc.service';
import { MultiplayerLobbyPlayersService } from 'app/services/multiplayer-lobby-players.service';
import { ToastService } from 'app/services/toast.service';
import { WebhookService } from 'app/services/webhook.service';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';
import { IrcChannel } from './irc/irc-channel';
import { MultiplayerLobbyPlayers } from './multiplayer-lobby-players/multiplayer-lobby-players';
import { MultiplayerLobbyPlayersPlayer } from './multiplayer-lobby-players/multiplayer-lobby-players-player';
import { PickedCategory } from './picked-category';
import { MultiplayerData } from './store-multiplayer/multiplayer-data';
import { ToastType } from './toast';
import { WyMappool } from './wytournament/mappool/wy-mappool';
import { WyModBracket } from './wytournament/mappool/wy-mod-bracket';
import { WyModBracketMap } from './wytournament/mappool/wy-mod-bracket-map';
import { WyModCategory } from './wytournament/mappool/wy-mod-category';
import { WyStage } from './wytournament/wy-stage';
import { WyTeamPlayer } from './wytournament/wy-team-player';
import { WyTournament } from './wytournament/wy-tournament';

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

	teamOneOverwriteScore: number;
	teamTwoOverwriteScore: number;

	teamOneBans: number[];
	teamTwoBans: number[];

	teamOnePicks: number[];
	teamTwoPicks: number[];

	teamOneSlotArray: number[];
	teamTwoSlotArray: number[];

	teamOneCaptain: WyTeamPlayer;
	teamTwoCaptain: WyTeamPlayer;

	gamesCountTowardsScore: unknown;

	multiplayerData: MultiplayerData[];
	pickedCategories: PickedCategory[];

	ircConnected: boolean;

	isQualifierLobby: boolean;
	sendWebhooks: boolean;

	constructor(init?: Partial<Lobby>) {
		this.teamOneBans = [];
		this.teamTwoBans = [];

		this.teamOnePicks = [];
		this.teamTwoPicks = [];

		Lobby.initializeTeamSlotArray(this);

		this.gamesCountTowardsScore = {};

		this.multiplayerData = [];
		this.pickedCategories = [];

		this.teamOneScore = 0;
		this.teamTwoScore = 0;

		this.teamOneOverwriteScore = 0;
		this.teamTwoOverwriteScore = 0;

		this.ircConnected = false;

		this.isQualifierLobby = false;
		this.sendWebhooks = true;

		Object.assign(this, init);
	}

	/**
	 * Make a true copy of the given lobby
	 *
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
			teamOneOverwriteScore: !isNaN(lobby.teamOneOverwriteScore) ? lobby.teamOneOverwriteScore : 0,
			teamTwoOverwriteScore: !isNaN(lobby.teamTwoOverwriteScore) ? lobby.teamTwoOverwriteScore : 0,
			teamOneBans: lobby.teamOneBans,
			teamTwoBans: lobby.teamTwoBans,
			teamOnePicks: lobby.teamOnePicks,
			teamTwoPicks: lobby.teamTwoPicks,
			gamesCountTowardsScore: lobby.gamesCountTowardsScore,
			isQualifierLobby: lobby.isQualifierLobby,
			sendWebhooks: lobby.sendWebhooks
		});

		Lobby.initializeTeamSlotArray(newLobby);

		for (const pickedCategory in lobby.pickedCategories) {
			newLobby.pickedCategories.push(PickedCategory.makeTrueCopy(lobby.pickedCategories[pickedCategory]));
		}

		for (const multiplayerData in lobby.multiplayerData) {
			newLobby.multiplayerData.push(MultiplayerData.makeTrueCopy(lobby.multiplayerData[multiplayerData]));
		}

		return newLobby;
	}

	/**
	 * Get the id of the multiplayer link
	 *
	 * @param link the link to the multiplayer lobby
	 */
	public static getMultiplayerIdFromLink(link: string): string {
		const regularExpression = new RegExp(/https:\/\/osu\.ppy\.sh\/community\/matches\/([0-9]+)/).exec(link);

		if (regularExpression) {
			return regularExpression[1];
		}

		return null;
	}

	/**
	 * Initialize the team slot arrays
	 *
	 * @param lobby the lobby to initialize the team slot arrays for
	 */
	private static initializeTeamSlotArray(lobby: Lobby): void {
		lobby.teamOneSlotArray = [];
		lobby.teamTwoSlotArray = [];

		for (let i = 0; i < lobby.teamSize * 2; i++) {
			if (i < lobby.teamSize) {
				lobby.teamOneSlotArray.push(i);
			}
			else {
				lobby.teamTwoSlotArray.push(i);
			}
		}
	}

	/**
	 * Get an array with all players of the given team name
	 *
	 * @param teamName the name of the team
	 */
	getTeamPlayersFromTournament(teamName: string): WyTeamPlayer[] {
		for (const team of this.tournament.teams) {
			if (team.name == teamName) {
				if (this.tournament != null) {
					if (this.tournament.isSoloTournament()) {
						return [
							new WyTeamPlayer({ name: team.name })
						];
					}
				}

				return team.players;
			}
		}

		return null;
	}

	/**
	 * Get an array with all players of the tournament if its a solo tournament
	 */
	getSoloPlayersFromTournament(): WyTeamPlayer[] {
		const allPlayers: WyTeamPlayer[] = [];

		if (this.tournament.isSoloTournament()) {
			for (const team of this.tournament.teams) {
				allPlayers.push(new WyTeamPlayer({
					name: team.name
				}));
			}
		}

		return allPlayers;
	}

	/**
	 * Check if the multiplayer data exists in the lobby
	 *
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
	 *
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
	 *
	 * @param multiplayerData the multiplayer data to add
	 */
	addMultiplayerData(multiplayerData: MultiplayerData): void {
		this.multiplayerData.push(multiplayerData);
	}

	/**
	 * Get the name of the team that has to pick next
	 */
	getNextPick() {
		const totalMapsPlayed = this.getTeamOneScore() + this.getTeamTwoScore();
		let nextPick = '';

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
		if (this.getTeamOneScore() == Math.floor(this.bestOf / 2)) {
			return this.teamOneName;
		}
		else if (this.getTeamTwoScore() == Math.floor(this.bestOf / 2)) {
			return this.teamTwoName;
		}

		return null;
	}

	/**
	 * Check if a team has won the match
	 */
	teamHasWon(): string {
		if (this.getTeamOneScore() == Math.ceil(this.bestOf / 2)) {
			return this.teamOneName;
		}
		else if (this.getTeamTwoScore() == Math.ceil(this.bestOf / 2)) {
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
		return this.tournament == null ? this.description : `${this.tournament.acronym}: ${this.description}`;
	}

	/**
	 * Mark a category as picked in the given mod bracket
	 *
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
	 * Check if a beatmap is banned int he current lobby
	 *
	 * @param beatmapId the beatmap to check
	 */
	beatmapIsBanned(beatmapId: number) {
		return this.teamOneBans.indexOf(beatmapId) > -1 || this.teamTwoBans.indexOf(beatmapId) > -1;
	}

	/**
	 * Check if the beatmap is banned by team one
	 *
	 * @param beatmapId the beatmap to check
	 */
	beatmapIsBannedByTeamOne(beatmapId: number) {
		return this.teamOneBans.indexOf(beatmapId) > -1;
	}

	/**
	 * Check if the beatmap is banned by team two
	 *
	 * @param beatmapId the beatmap to check
	 */
	beatmapIsBannedByTeamTwo(beatmapId: number) {
		return this.teamTwoBans.indexOf(beatmapId) > -1;
	}

	/**
	 * Check if a beatmap has been picked in the current lobby
	 *
	 * @param beatmapId the beatmap to check
	 */
	beatmapIsPicked(beatmapId: number) {
		return this.teamOnePicks != null && this.teamTwoPicks != null &&
			(this.teamOnePicks.indexOf(beatmapId) > -1 || this.teamTwoPicks.indexOf(beatmapId) > -1);
	}

	/**
	 * Check if the beatmap that is being picked came from the same mod bracket as the last pick was from
	 *
	 * @param bracket the bracket to check from
	 */
	wasBeatmapPickedFromSamePreviousModBracket(bracket: WyModBracket): boolean {
		if (this.getNextPick() == this.teamOneName) {
			if (this.teamOnePicks.length <= 0) {
				return false;
			}

			const lastPick = this.teamOnePicks[this.teamOnePicks.length - 1];

			for (const beatmap of bracket.beatmaps) {
				if (beatmap.beatmapId == lastPick) {
					return true;
				}
			}
		}
		else if (this.getNextPick() == this.teamTwoName) {
			if (this.teamTwoPicks.length <= 0) {
				return false;
			}

			const lastPick = this.teamTwoPicks[this.teamTwoPicks.length - 1];

			for (const beatmap of bracket.beatmaps) {
				if (beatmap.beatmapId == lastPick) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Pick a beatmap from the given bracket
	 *
	 * @param beatmap the picked beatmap
	 * @param bracket the bracket where the beatmap is from
	 */
	pickBeatmap(selectedChannel: IrcChannel, beatmap: WyModBracketMap, bracket: WyModBracket, gamemode: number, toastService: ToastService, ircService: IrcService, dialog: MatDialog, multiplayerLobbies: WyMultiplayerLobbiesService, webhookService: WebhookService, forcePick = false) {
		// Prevent picking when firstPick isn't set
		if (this.firstPick == undefined) {
			toastService.addToast('You haven\'t set who picks first yet.', ToastType.Error);

			const dialogRef = dialog.open(MultiplayerLobbySettingsComponent, {
				data: {
					multiplayerLobby: this
				}
			});

			dialogRef.afterClosed().subscribe((result: Lobby) => {
				if (result != null) {
					multiplayerLobbies.updateMultiplayerLobby(result);
				}
			});

			return;
		}

		// Check if teams are allowed to pick from the same modbracket twice in a row
		if (this.tournament.allowDoublePick == false) {
			if (this.wasBeatmapPickedFromSamePreviousModBracket(bracket) && forcePick == false) {
				const dialogRef = dialog.open(IrcPickMapSameModBracketComponent, {
					data: {
						beatmap: beatmap,
						modBracket: bracket,
						lobby: this
					}
				});

				dialogRef.afterClosed().subscribe((result: boolean) => {
					if (result == true) {
						this.pickBeatmap(selectedChannel, beatmap, bracket, gamemode, toastService, ircService, dialog, multiplayerLobbies, webhookService, true);
					}
				});

				return;
			}
		}

		ircService.sendMessage(selectedChannel.name, `!mp map ${beatmap.beatmapId} ${gamemode}`);

		let modBit = 0;
		let freemodEnabled = false;

		for (const mod in bracket.mods) {
			if (bracket.mods[mod].value != 'freemod') {
				modBit += Number(bracket.mods[mod].value);
			}
			else {
				freemodEnabled = true;
			}
		}

		// Add an extra null check
		if (this.teamOnePicks == null) {
			this.teamOnePicks = [];
		}

		if (this.teamTwoPicks == null) {
			this.teamTwoPicks = [];
		}

		webhookService.sendBeatmapPicked(this, ircService.authenticatedUser, this.getNextPick(), beatmap);

		// Update picks
		if (this.teamOneName == this.getNextPick()) {
			this.teamOnePicks.push(beatmap.beatmapId);
		}
		else {
			this.teamTwoPicks.push(beatmap.beatmapId);
		}

		multiplayerLobbies.updateMultiplayerLobby(this);

		ircService.sendMessage(selectedChannel.name, `!mp mods ${modBit}${freemodEnabled ? ' freemod' : ''}`);
	}

	/**
	 * Calculate the score of team one with score overwriting
	 */
	getTeamOneScore(): number {
		return this.teamOneScore + this.teamOneOverwriteScore;
	}

	/**
	 * Calculate the score of team two with score overwriting
	 */
	getTeamTwoScore(): number {
		return this.teamTwoScore + this.teamTwoOverwriteScore;
	}

	/**
	 * Get a player by the username
	 *
	 * @param username the username of the user to get
	 * @returns
	 */
	getPlayerByUsername(username: string, multiplayerLobbyPlayersService: MultiplayerLobbyPlayersService): MultiplayerLobbyPlayersPlayer {
		const multiplayerLobbyPlayers: MultiplayerLobbyPlayers = multiplayerLobbyPlayersService.multiplayerLobbies[this.lobbyId].players;

		for (const user of multiplayerLobbyPlayers.players) {
			if (user.username == username) {
				return user;
			}
		}

		return null;
	}

	/**
	 * Get the correct slot the player has to be in
	 *
	 * @param username the username to get the correct slot for
	 */
	getCorrectSlot(username: string): string {
		// Solo tournament
		if (this.tournament.isSoloTournament()) {
			if (this.teamOneName == username) {
				return '1';
			}
			else if (this.teamTwoName == username) {
				return '2';
			}
		}
		// Team tournament
		else {
			for (const team of this.tournament.teams) {
				for (const player of team.players) {
					if (player.name == username) {
						if (this.teamOneName == team.name) {
							let teamSlotString = '';

							for (let i = 0; i < this.teamOneSlotArray.length; i++) {
								teamSlotString += (this.teamOneSlotArray[i] + 1);

								console.log(i, this.teamOneSlotArray.length);

								if (i != (this.teamOneSlotArray.length - 2)) {
									teamSlotString += ', ';
								}
								else {
									teamSlotString += ' or ';
								}
							}

							teamSlotString = teamSlotString.substring(0, teamSlotString.length - 2);

							return teamSlotString;
						}
						else if (this.teamTwoName == team.name) {
							let teamSlotString = '';

							for (let i = 0; i < this.teamTwoSlotArray.length; i++) {
								teamSlotString += (this.teamTwoSlotArray[i] + 1);

								console.log(i, this.teamTwoSlotArray.length);

								if (i != (this.teamTwoSlotArray.length - 2)) {
									teamSlotString += ', ';
								}
								else {
									teamSlotString += ' or ';
								}
							}

							teamSlotString = teamSlotString.substring(0, teamSlotString.length - 2);

							return teamSlotString;
						}
					}
				}
			}
		}

		return 'Unknown';
	}
}
