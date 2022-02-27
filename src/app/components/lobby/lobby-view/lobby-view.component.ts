import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from '../../../services/electron.service';
import { ToastService } from '../../../services/toast.service';
import { CacheService } from '../../../services/cache.service';
import { MultiplayerData } from '../../../models/store-multiplayer/multiplayer-data';
import { MultiplayerDataUser } from '../../../models/store-multiplayer/multiplayer-data-user';
import { StoreService } from '../../../services/store.service';
import { IrcService } from '../../../services/irc.service';
import { ClipboardService } from 'ngx-clipboard';
import { WebhookService } from '../../../services/webhook.service';
import { CacheBeatmap } from '../../../models/cache/cache-beatmap';
import { MatDialog } from '@angular/material/dialog';
import { MultiplayerLobbySettingsComponent } from 'app/components/dialogs/multiplayer-lobby-settings/multiplayer-lobby-settings.component';
import { SendFinalResultComponent } from 'app/components/dialogs/send-final-result/send-final-result.component';
import { OsuHelper } from 'app/models/osu-models/osu';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';
import { Lobby } from 'app/models/lobby';

export interface MultiplayerLobbySettingsDialogData {
	multiplayerLobby: Lobby;
}

export interface MultiplayerLobbySendFinalMessageDialogData {
	multiplayerLobby: Lobby;

	winByDefault: boolean;

	winningTeam: string;
	losingTeam: string;

	extraMessage: string;
}

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
		private cacheService: CacheService,
		public electronService: ElectronService,
		private storeService: StoreService,
		public ircService: IrcService,
		private clipboardService: ClipboardService,
		private router: Router,
		private webhookService: WebhookService,
		private dialog: MatDialog) {
		this.route.params.subscribe(params => {
			this.selectedLobby = multiplayerLobbies.getMultiplayerLobby(params.id);

			this.selectedLobby.ircChannel = this.ircService.getChannelByName(`#mp_${this.getMultiplayerIdFromLink(this.selectedLobby.multiplayerLink)}`);

			if (ircService.getChannelByName(this.selectedLobby.ircChannel.name) != null && ircService.getChannelByName(this.selectedLobby.ircChannel.name).active) {
				this.selectedLobby.ircConnected = true;
			}

			this.selectedLobby.teamOneSlotArray = [];
			this.selectedLobby.teamTwoSlotArray = [];

			// Setup the team arrays
			for (let i: any = 0; i < this.selectedLobby.teamSize * 2; i++) {
				if (i < this.selectedLobby.teamSize) {
					this.selectedLobby.teamOneSlotArray.push(parseInt(i));
				}
				else {
					this.selectedLobby.teamTwoSlotArray.push(parseInt(i));
				}
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
	 * NOTE: Update in send-beatmap-result.component.ts as well
	 *
	 * @param match
	 */
	sendBeatmapResult(match: MultiplayerData) {
		// User is connected to irc channel
		if (this.selectedLobby.ircChannel != null) {
			const totalMapsPlayed = this.selectedLobby.teamOneScore + this.selectedLobby.teamTwoScore;
			let nextPick = '';

			// First pick goes to .firstPick
			if (totalMapsPlayed % 2 == 0) {
				nextPick = this.selectedLobby.firstPick;
			}
			else {
				nextPick = this.selectedLobby.firstPick == this.selectedLobby.teamOneName ? this.selectedLobby.teamTwoName : this.selectedLobby.teamOneName;
			}

			if (match.team_one_score > match.team_two_score) {
				const teamOneHasWon = (this.selectedLobby.teamOneScore == Math.ceil(this.selectedLobby.bestOf / 2));
				this.ircService.sendMessage(this.selectedLobby.ircChannel.name, `"${this.selectedLobby.teamOneName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.getBeatmapname(match.beatmap_id)}] | Score: ${this.addDot(match.team_one_score, ' ')} - ${this.addDot(match.team_two_score, ' ')} // Score difference : ${this.addDot(match.team_one_score - match.team_two_score, ' ')}${(totalMapsPlayed != 0) ? ` | ${this.selectedLobby.teamOneName} | ${this.selectedLobby.teamOneScore} : ${this.selectedLobby.teamTwoScore} | ${this.selectedLobby.teamTwoName} ${!teamOneHasWon ? '// Next pick is for ' + nextPick : ''}` : ''}`);
			}
			else {
				const teamTwoHasWon = (this.selectedLobby.teamTwoScore == Math.ceil(this.selectedLobby.bestOf / 2));
				this.ircService.sendMessage(this.selectedLobby.ircChannel.name, `"${this.selectedLobby.teamTwoName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.getBeatmapname(match.beatmap_id)}] | Score: ${this.addDot(match.team_one_score, ' ')} - ${this.addDot(match.team_two_score, ' ')} // Score difference : ${this.addDot(match.team_two_score - match.team_one_score, ' ')}${(totalMapsPlayed != 0) ? ` | ${this.selectedLobby.teamOneName} | ${this.selectedLobby.teamOneScore} : ${this.selectedLobby.teamTwoScore} | ${this.selectedLobby.teamTwoName} ${!teamTwoHasWon ? '// Next pick is for ' + nextPick : ''}` : ''}`);
			}
		}
	}

	/**
	 * Copy the result of the beatmap to the clipboard
	 * @param match
	 */
	copyBeatmapResult(match: MultiplayerData) {
		let string = '';

		if (match.team_one_score > match.team_two_score) {
			string = `"${this.selectedLobby.teamOneName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.getBeatmapname(match.beatmap_id)}] | ${this.selectedLobby.teamOneName} : ${match.team_one_score} | ${this.selectedLobby.teamTwoName} : ${match.team_two_score} | Score difference : ${match.team_one_score - match.team_two_score}`;
		}
		else {
			string = `"${this.selectedLobby.teamTwoName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.getBeatmapname(match.beatmap_id)}] | ${this.selectedLobby.teamOneName} : ${match.team_one_score} | ${this.selectedLobby.teamTwoName} : ${match.team_two_score} | Score difference : ${match.team_two_score - match.team_one_score}`;
		}

		this.clipboardService.copyFromContent(string);

		this.toastService.addToast(`Copied the result for "${this.getBeatmapname(match.beatmap_id)}"`);
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
	 * @param match the match
	 */
	markAsInvalid(match: MultiplayerData) {
		this.selectedLobby.gamesCountTowardsScore[match.game_id] = !this.selectedLobby.gamesCountTowardsScore[match.game_id];
		this.storeService.set(`lobby.${this.selectedLobby.lobbyId}.countForScore.${match.game_id}`, this.selectedLobby.gamesCountTowardsScore[match.game_id]);

		if (this.selectedLobby.gamesCountTowardsScore[match.game_id]) {
			this.toastService.addToast(`"${this.getBeatmapname(match.beatmap_id)}" will now count towards the score.`);
		}
		else {
			this.toastService.addToast(`"${this.getBeatmapname(match.beatmap_id)}" will no longer count towards the score.`);
		}

		// Re-synchronize the lobby to change game counter
		this.multiplayerLobbies.synchronizeMultiplayerMatch(this.selectedLobby, false);
	}

	/**
	 * Get the modifier for the given beatmapid
	 * @param beatmapId the beatmapid to get the modifier for
	 */
	getModifier(beatmapId: number) {
		if (this.selectedLobby.tournament != null) {
			return this.selectedLobby.tournament.getModifierFromBeatmapId(beatmapId);
		}

		return null;
	}

	/**
	 * Get the cached beatmap if it exists
	 * @param beatmapId the beatmapid
	 */
	getBeatmapname(beatmapId: number) {
		const cachedBeatmap = this.cacheService.getCachedBeatmap(beatmapId);
		return (cachedBeatmap != null) ? cachedBeatmap.name : 'Unknown beatmap, synchronize the lobby to get the map name.';
	}

	/**
	 * Get a beatmap from any given mappool
	 * @param beatmapId the beatmapid
	 */
	getBeatmapnameFromMappools(beatmapId: number): CacheBeatmap {
		const cachedBeatmap = this.cacheService.getCachedBeatmapFromMappools(beatmapId);
		return (cachedBeatmap != null) ? cachedBeatmap : null;
	}

	/**
	 * Get the cover image
	 * @param beatmapId the beatmapid
	 */
	getBeatmapCoverUrl(beatmapId: number): string {
		const cachedBeatmap = this.cacheService.getCachedBeatmap(beatmapId);
		return (cachedBeatmap != null) ? `https://assets.ppy.sh/beatmaps/${cachedBeatmap.beatmapSetId}/covers/cover.jpg` : '';
	}

	/**
	 * Get the beatmap url
	 * @param beatmapId the beatmapid
	 */
	getBeatmapUrlFromId(beatmapId: number): string {
		return `https://osu.ppy.sh/beatmaps/${beatmapId}`;
	}

	/**
	 * Get the cached username
	 * @param userId the userid
	 */
	getUsernameFromUserId(userId: number) {
		const cachedUser = this.cacheService.getCachedUser(userId);
		return (cachedUser != null) ? cachedUser.username : 'Unknown';
	}

	/**
	 * Get the accuracy of the player in the given slot
	 * @param match the MultiplayerData
	 * @param slotId the slot you want the accuracy from
	 */
	getAccuracy(match: MultiplayerData, slotId: number): any {
		const user: MultiplayerDataUser = match.getPlayer(slotId);

		return (user != undefined) ? user.accuracy : 0.00
	}

	/**
	 * Get the score of the player in the given slot
	 * @param match the MultiplayerData
	 * @param slotId the slot you want the score from
	 */
	getScore(match: MultiplayerData, slotId: number) {
		const user: MultiplayerDataUser = match.getPlayer(slotId);

		return (user != undefined) ? this.addDot(user.score % 1 == 0 ? user.score : user.score.toFixed(), ' ') : 0;
	}

	/**
	 * Get the mods of the player in the given slot
	 * @param match the MultiplayerData
	 * @param slotId the slot you want the mods from
	 */
	getMods(match: MultiplayerData, slotId: number): string[] {
		const user: MultiplayerDataUser = match.getPlayer(slotId);
		const mods: string[] = [];

		const selectedMods = OsuHelper.getModsFromBit(user.mods);

		for (const mod of selectedMods) {
			mods.push(OsuHelper.getModAbbreviation(mod));
		}

		return (user != undefined || user.mods != undefined) ? mods : [];
	}

	/**
	 * Get the mods of the multiplayer lobby
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
	 * Split the string
	 * @param nStr the string to split
	 * @param splitter the character to split the string with
	 */
	addDot(nStr: any, splitter: any) {
		nStr += '';
		const x = nStr.split('.');
		let x1: string = x[0];
		const x2 = x.length > 1 ? `.${x[1]}` : '';
		const rgx = /(\d+)(\d{3})/;

		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, `$1${splitter}$2`);
		}

		return x1 + x2;
	}

	/**
	 * Get the id of the multiplayer link
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

		dialogRef.afterClosed().subscribe((result: MultiplayerLobbySendFinalMessageDialogData) => {
			if (result.winByDefault) {
				this.webhookService.sendWinByDefaultResult(result.multiplayerLobby, result.extraMessage, result.winningTeam, result.losingTeam, this.ircService.authenticatedUser);
			}
			else {
				this.webhookService.sendFinalResult(result.multiplayerLobby, result.extraMessage, this.ircService.authenticatedUser);
			}
		});
	}
}
