import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MultiplayerLobbySettingsComponent } from 'app/components/dialogs/multiplayer-lobby-settings/multiplayer-lobby-settings.component';
import { SendFinalResultComponent } from 'app/components/dialogs/send-final-result/send-final-result.component';
import { OsuHelper } from 'app/models/osu-models/osu';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';
import { Lobby } from 'app/models/lobby';
import { MultiplayerData } from 'app/models/store-multiplayer/multiplayer-data';
import { MultiplayerDataUser } from 'app/models/store-multiplayer/multiplayer-data-user';
import { CacheService } from 'app/services/cache.service';
import { ElectronService } from 'app/services/electron.service';
import { IrcService } from 'app/services/irc.service';
import { StoreService } from 'app/services/store.service';
import { ToastService } from 'app/services/toast.service';
import { WebhookService } from 'app/services/webhook.service';
import { ClipboardService } from 'ngx-clipboard';
import { IMultiplayerLobbySendFinalMessageDialogData } from 'app/interfaces/i-multiplayer-lobby-send-final-message-dialog-data';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastType } from 'app/models/toast';
import { ChallongeService } from 'app/services/challonge.service';
import { Misc } from 'app/shared/misc';

@Component({
	selector: 'app-lobby-view',
	templateUrl: './lobby-view.component.html',
	styleUrls: ['./lobby-view.component.scss']
})

export class LobbyViewComponent implements OnInit {
	selectedLobby: Lobby;
	settingsTabIsOpened = false;

	wbdSelected = false;
	normalResultSelected = false;

	extraMessage: string;

	wbdWinningTeam: string;
	wbdLosingTeam: string;

	constructor(
		private route: ActivatedRoute,
		private multiplayerLobbies: WyMultiplayerLobbiesService,
		private toastService: ToastService,
		public cacheService: CacheService,
		public electronService: ElectronService,
		private storeService: StoreService,
		public ircService: IrcService,
		private clipboardService: ClipboardService,
		private router: Router,
		private webhookService: WebhookService,
		private dialog: MatDialog,
		private challongeService: ChallongeService) {
		this.route.params.subscribe(params => {
			this.selectedLobby = multiplayerLobbies.getMultiplayerLobby(params.id);

			this.selectedLobby.ircChannel = this.ircService.getChannelByName(`#mp_${this.getMultiplayerIdFromLink(this.selectedLobby.multiplayerLink)}`);

			if (ircService.getChannelByName(this.selectedLobby.ircChannel.name) != null && ircService.getChannelByName(this.selectedLobby.ircChannel.name).active) {
				this.selectedLobby.ircConnected = true;
			}
		});
	}

	ngOnInit() { }

	/**
	 * Synchronizes the multiplayer lobby and calculates all the scores
	 */
	synchronizeMp() {
		this.toastService.addToast('Synchronizing multiplayer lobby...');

		// console.time('synchronize-lobby');
		this.multiplayerLobbies.synchronizeMultiplayerMatch(this.selectedLobby, true, false);
		// console.timeEnd('synchronize-lobby');
	}

	/**
	 * Send the result of the beatmap to irc if connected
	 * NOTE: Update in send-beatmap-result.component.ts and irc.component.ts as well
	 *
	 * @param match
	 */
	sendBeatmapResult(match: MultiplayerData) {
		// User is connected to irc channel
		if (this.selectedLobby.ircChannel != null) {
			const totalMapsPlayed = this.selectedLobby.getTeamOneScore() + this.selectedLobby.getTeamTwoScore();
			let nextPick = '';

			// First pick goes to .firstPick
			if (totalMapsPlayed % 2 == 0) {
				nextPick = this.selectedLobby.firstPick;
			}
			else {
				nextPick = this.selectedLobby.firstPick == this.selectedLobby.teamOneName ? this.selectedLobby.teamTwoName : this.selectedLobby.teamOneName;
			}

			if (match.team_one_score > match.team_two_score) {
				const teamOneHasWon = (this.selectedLobby.getTeamOneScore() == Math.ceil(this.selectedLobby.bestOf / 2));
				this.ircService.sendMessage(this.selectedLobby.ircChannel.name, `"${this.selectedLobby.teamOneName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.cacheService.getBeatmapname(match.beatmap_id)}] | Score: ${this.addDot(match.team_one_score, ' ')} - ${this.addDot(match.team_two_score, ' ')} // Score difference : ${this.addDot(match.team_one_score - match.team_two_score, ' ')}${(totalMapsPlayed != 0) ? ` | ${this.selectedLobby.teamOneName} | ${this.selectedLobby.getTeamOneScore()} : ${this.selectedLobby.getTeamTwoScore()} | ${this.selectedLobby.teamTwoName} ${!teamOneHasWon ? '// Next pick is for ' + nextPick : ''}` : ''}`);
			}
			else {
				const teamTwoHasWon = (this.selectedLobby.teamTwoScore == Math.ceil(this.selectedLobby.bestOf / 2));
				this.ircService.sendMessage(this.selectedLobby.ircChannel.name, `"${this.selectedLobby.teamTwoName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.cacheService.getBeatmapname(match.beatmap_id)}] | Score: ${this.addDot(match.team_one_score, ' ')} - ${this.addDot(match.team_two_score, ' ')} // Score difference : ${this.addDot(match.team_two_score - match.team_one_score, ' ')}${(totalMapsPlayed != 0) ? ` | ${this.selectedLobby.teamOneName} | ${this.selectedLobby.getTeamOneScore()} : ${this.selectedLobby.getTeamTwoScore()} | ${this.selectedLobby.teamTwoName} ${!teamTwoHasWon ? '// Next pick is for ' + nextPick : ''}` : ''}`);
			}
		}
	}

	/**
	 * Copy the result of the beatmap to the clipboard
	 *
	 * @param match
	 */
	copyBeatmapResult(match: MultiplayerData) {
		let beatmapResult = '';

		if (match.team_one_score > match.team_two_score) {
			beatmapResult = `"${this.selectedLobby.teamOneName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.cacheService.getBeatmapname(match.beatmap_id)}] | ${this.selectedLobby.teamOneName} : ${match.team_one_score} | ${this.selectedLobby.teamTwoName} : ${match.team_two_score} | Score difference : ${match.team_one_score - match.team_two_score}`;
		}
		else {
			beatmapResult = `"${this.selectedLobby.teamTwoName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.cacheService.getBeatmapname(match.beatmap_id)}] | ${this.selectedLobby.teamOneName} : ${match.team_one_score} | ${this.selectedLobby.teamTwoName} : ${match.team_two_score} | Score difference : ${match.team_two_score - match.team_one_score}`;
		}

		this.clipboardService.copyFromContent(beatmapResult);

		this.toastService.addToast(`Copied the result for "${this.cacheService.getBeatmapname(match.beatmap_id)}"`);
	}

	/**
	 * Send the result of the match to irc if connected
	 */
	sendMatchResult() {
		// User is connected to irc channel
		if (this.selectedLobby.ircChannel != null) {
			this.ircService.sendMessage(this.selectedLobby.ircChannel.name, `${this.selectedLobby.teamOneName} | ${this.selectedLobby.teamOneScore} : ${this.selectedLobby.teamTwoScore} | ${this.selectedLobby.teamTwoName}`);
		}
	}

	/**
	 * Copy the result of the match to the clipboard
	 */
	copyMatchResult() {
		this.clipboardService.copyFromContent(`${this.selectedLobby.teamOneName} | ${this.selectedLobby.teamOneScore} : ${this.selectedLobby.teamTwoScore} | ${this.selectedLobby.teamTwoName}`);
	}

	/**
	 * Open a dialog for the multiplayer lobby settings
	 *
	 * @param selectedLobby
	 */
	openSettings(selectedLobby: Lobby) {
		const dialogRef = this.dialog.open(MultiplayerLobbySettingsComponent, {
			data: {
				multiplayerLobby: selectedLobby
			}
		});

		dialogRef.afterClosed().subscribe((result: Lobby) => {
			if (result != null) {
				this.multiplayerLobbies.updateMultiplayerLobby(result);
			}
		});
	}

	/**
	 * Mark the match as valid or invalid so that it counts towards the team score
	 *
	 * @param match the match
	 */
	markAsInvalid(match: MultiplayerData) {
		this.selectedLobby.gamesCountTowardsScore[match.game_id] = !this.selectedLobby.gamesCountTowardsScore[match.game_id];
		this.storeService.set(`lobby.${this.selectedLobby.lobbyId}.countForScore.${match.game_id}`, this.selectedLobby.gamesCountTowardsScore[match.game_id]);

		if (this.selectedLobby.gamesCountTowardsScore[match.game_id]) {
			this.toastService.addToast(`"${this.cacheService.getBeatmapname(match.beatmap_id)}" will now count towards the score.`);
		}
		else {
			this.toastService.addToast(`"${this.cacheService.getBeatmapname(match.beatmap_id)}" will no longer count towards the score.`);
		}

		// Re-synchronize the lobby to change game counter
		this.multiplayerLobbies.synchronizeMultiplayerMatch(this.selectedLobby, false);
	}

	/**
	 * Get the modifier for the given beatmapid
	 *
	 * @param beatmapId the beatmapid to get the modifier for
	 */
	getModifier(beatmapId: number) {
		if (this.selectedLobby.tournament != null) {
			return this.selectedLobby.tournament.getModifierFromBeatmapId(beatmapId);
		}

		return null;
	}

	/**
	 * Get the beatmap url
	 *
	 * @param beatmapId the beatmapid
	 */
	getBeatmapUrlFromId(beatmapId: number): string {
		return `https://osu.ppy.sh/beatmaps/${beatmapId}`;
	}

	/**
	 * Get the cached username
	 *
	 * @param userId the userid
	 */
	getUsernameFromUserId(userId: number) {
		const cachedUser = this.cacheService.getCachedUser(userId);
		return (cachedUser != null) ? cachedUser.username : 'Unknown';
	}

	/**
	 * Get the accuracy of the player in the given slot
	 *
	 * @param match the MultiplayerData
	 * @param slotId the slot you want the accuracy from
	 */
	getAccuracy(match: MultiplayerData, slotId: number): any {
		const user: MultiplayerDataUser = match.getPlayer(slotId);

		return (user != undefined) ? user.accuracy : 0.00;
	}

	/**
	 * Get the score of the player in the given slot
	 *
	 * @param match the MultiplayerData
	 * @param slotId the slot you want the score from
	 */
	getScore(match: MultiplayerData, slotId: number) {
		const user: MultiplayerDataUser = match.getPlayer(slotId);

		return (user != undefined) ? this.addDot(user.score % 1 == 0 ? user.score : user.score.toFixed(), ' ') : 0;
	}

	/**
	 * Get the mods of the player in the given slot
	 *
	 * @param match the MultiplayerData
	 * @param slotId the slot you want the mods from
	 */
	getModsBySlotId(match: MultiplayerData, slotId: number): string[] {
		const user: MultiplayerDataUser = match.getPlayer(slotId);
		const mods: string[] = [];

		const selectedMods = OsuHelper.getModsFromBit(user.mods);

		for (const mod of selectedMods) {
			mods.push(OsuHelper.getModAbbreviation(mod));
		}

		return (user != undefined || user.mods != undefined) ? mods : [];
	}

	/**
	 * Get the mods of the player in the given slot
	 *
	 * @param match the MultiplayerData
	 * @param slotId the slot you want the mods from
	 */
	getModsFromPlayer(player: MultiplayerDataUser): string[] {
		const mods: string[] = [];

		const selectedMods = OsuHelper.getModsFromBit(player.mods);

		for (const mod of selectedMods) {
			mods.push(OsuHelper.getModAbbreviation(mod));
		}

		return (player != undefined || player.mods != undefined) ? mods : [];
	}

	/**
	 * Get the mods of the multiplayer lobby
	 *
	 * @param modBit the mods as bit
	 */
	getModsFromBit(modBit: number): string[] {
		const mods: string[] = [];

		const selectedMods = OsuHelper.getModsFromBit(modBit);

		for (const mod of selectedMods) {
			mods.push(OsuHelper.getModAbbreviation(mod));
		}

		return mods;
	}

	/**
	 * Check whether the beatmap uses reverse scoring
	 *
	 * @param beatmapId the beatmap to check
	 */
	isReverseScoreBeatmap(beatmapId: number) {
		if (this.selectedLobby.mappool) {
			for (const modBracket of this.selectedLobby.mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					if (beatmap.beatmapId == beatmapId && beatmap.reverseScore == true) {
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * Split the string
	 *
	 * @param nStr the string to split
	 * @param splitter the character to split the string with
	 */
	addDot(nStr: string | number, splitter: string) {
		return Misc.addDot(nStr, splitter);
	}

	/**
	 * Get the id of the multiplayer link
	 *
	 * @param link the multiplayerlink
	 */
	getMultiplayerIdFromLink(link: string) {
		const regularExpression = new RegExp(/https:\/\/osu\.ppy\.sh\/community\/matches\/([0-9]+)/).exec(link);

		if (regularExpression) {
			return regularExpression[1];
		}

		return null;
	}

	goToIrc() {
		this.router.navigate(['irc']);
	}

	/**
	 * Toggle the WBD options
	 */
	toggleWBD() {
		this.wbdSelected = !this.wbdSelected;

		this.normalResultSelected = false;
		this.extraMessage = null;
	}

	/**
	 * Toggle the normal result options
	 */
	toggleNormalResult() {
		this.normalResultSelected = !this.normalResultSelected;

		this.wbdSelected = false;
		this.extraMessage = null;
	}

	/**
	 * Select the winning and losing team
	 *
	 * @param winningTeam
	 * @param losingTeam
	 */
	selectWBDTeam(winningTeam: string, losingTeam: string) {
		this.wbdWinningTeam = winningTeam;
		this.wbdLosingTeam = losingTeam;
	}

	/**
	 * Send the final result to discord
	 */
	sendFinalResult(multiplayerLobby: Lobby) {
		const dialogRef = this.dialog.open(SendFinalResultComponent, {
			data: {
				multiplayerLobby: multiplayerLobby
			}
		});

		dialogRef.afterClosed().subscribe((result: IMultiplayerLobbySendFinalMessageDialogData) => {
			if (result != undefined) {
				if (result.qualifierLobby) {
					this.webhookService.sendQualifierResult(result.multiplayerLobby, result.extraMessage, this.ircService.authenticatedUser);
				}
				else {
					if (result.winByDefault) {
						this.webhookService.sendWinByDefaultResult(result.multiplayerLobby, result.extraMessage, result.winningTeam, result.losingTeam, this.ircService.authenticatedUser);
					}
					else {
						this.webhookService.sendFinalResult(result.multiplayerLobby, result.extraMessage, this.ircService.authenticatedUser);
					}

					if (this.selectedLobby.tournament.hasWyBinConnected()) {
						this.challongeService.updateMatchScore(this.selectedLobby.tournament.wyBinTournamentId, this.selectedLobby.wybinStageId, this.selectedLobby.wybinMatchId, this.selectedLobby.selectedStage.name, this.selectedLobby.teamOneName, this.selectedLobby.teamTwoName, this.selectedLobby.getTeamOneScore(), this.selectedLobby.getTeamTwoScore(), this.selectedLobby.teamHasWon()).subscribe(() => {
						}, (error: HttpErrorResponse) => {
							this.toastService.addToast('Unable to update the match score to Challonge: ' + error.error.message, ToastType.Error);
						});
					}
				}
			}
		});
	}
}
