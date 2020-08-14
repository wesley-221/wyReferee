import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiplayerLobby } from '../../../models/store-multiplayer/multiplayer-lobby';
import { MultiplayerLobbiesService } from '../../../services/multiplayer-lobbies.service';
import { ElectronService } from '../../../services/electron.service';
import { ToastService } from '../../../services/toast.service';
import { CacheService } from '../../../services/cache.service';
import { MultiplayerData } from '../../../models/store-multiplayer/multiplayer-data';
import { MultiplayerDataUser } from '../../../models/store-multiplayer/multiplayer-data-user';
import { MappoolService } from '../../../services/mappool.service';
import { StoreService } from '../../../services/store.service';
import { IrcService } from '../../../services/irc.service';
import { ClipboardService } from 'ngx-clipboard';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var $: any;

@Component({
	selector: 'app-lobby-view',
	templateUrl: './lobby-view.component.html',
	styleUrls: ['./lobby-view.component.scss']
})

export class LobbyViewComponent implements OnInit {
	selectedLobby: MultiplayerLobby;
	settingsTabIsOpened: boolean = false;
	wbdSelected: boolean = false;
	extraMessage: string;

	wbdWinningTeam: string;
	wbdLosingTeam: string;

	constructor(
		private route: ActivatedRoute,
		private multiplayerLobbies: MultiplayerLobbiesService,
		private toastService: ToastService,
		private cacheService: CacheService,
		public electronService: ElectronService,
		public mappoolService: MappoolService,
		private storeService: StoreService,
		public ircService: IrcService,
		private clipboardService: ClipboardService,
		private http: HttpClient,
		private router: Router) {
		this.route.params.subscribe(params => {
			this.selectedLobby = multiplayerLobbies.get(params.id);

			this.selectedLobby.ircChannel = `#mp_${this.getMultiplayerIdFromLink(this.selectedLobby.multiplayerLink)}`;

			if (ircService.getChannelByName(this.selectedLobby.ircChannel) != null && ircService.getChannelByName(this.selectedLobby.ircChannel).active) {
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
		this.multiplayerLobbies.synchronizeMultiplayerMatch(this.selectedLobby);
		// console.timeEnd('synchronize-lobby');
	}

	joinIrc() {
		const ircName = `#mp_${this.getMultiplayerIdFromLink(this.selectedLobby.multiplayerLink)}`;

		if (this.ircService.getChannelByName(ircName) != null) {
			this.toastService.addToast(`You are already in channel "${ircName}"`);
		}
		else {
			this.toastService.addToast(`Attempting to join channel "${ircName}"...`);
			this.ircService.joinChannel(ircName);
		}
	}

	/**
	 * Send the result of the beatmap to irc if connected
	 * @param match
	 */
	sendBeatmapResult(match: MultiplayerData) {
		// User is connected to irc channel
		if (this.ircService.getChannelByName(this.selectedLobby.ircChannel) != null) {
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
				this.ircService.sendMessage(this.selectedLobby.ircChannel, `"${this.selectedLobby.teamOneName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.getBeatmapname(match.beatmap_id)}] | Score: ${this.addDot(match.team_one_score, " ")} - ${this.addDot(match.team_two_score, " ")} // Score difference : ${this.addDot(match.team_one_score - match.team_two_score, " ")}${(totalMapsPlayed != 0) ? ` | ${this.selectedLobby.teamOneName} | ${this.selectedLobby.teamOneScore} : ${this.selectedLobby.teamTwoScore} | ${this.selectedLobby.teamTwoName} ${!teamOneHasWon ? "// Next pick is for " + nextPick : ''}` : ''}`);
			}
			else {
				const teamTwoHasWon = (this.selectedLobby.teamTwoScore == Math.ceil(this.selectedLobby.bestOf / 2));
				this.ircService.sendMessage(this.selectedLobby.ircChannel, `"${this.selectedLobby.teamTwoName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.getBeatmapname(match.beatmap_id)}] | Score: ${this.addDot(match.team_one_score, " ")} - ${this.addDot(match.team_two_score, " ")} // Score difference : ${this.addDot(match.team_two_score - match.team_one_score, " ")}${(totalMapsPlayed != 0) ? ` | ${this.selectedLobby.teamOneName} | ${this.selectedLobby.teamOneScore} : ${this.selectedLobby.teamTwoScore} | ${this.selectedLobby.teamTwoName} ${!teamTwoHasWon ? "// Next pick is for " + nextPick : ''}` : ''}`);
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
		if (this.ircService.getChannelByName(this.selectedLobby.ircChannel) != null) {
			this.ircService.sendMessage(this.selectedLobby.ircChannel, `${this.selectedLobby.teamOneName} | ${this.selectedLobby.teamOneScore} : ${this.selectedLobby.teamTwoScore} | ${this.selectedLobby.teamTwoName}`);
		}
	}

	/**
	 * Copy the result of the match to the clipboard
	 */
	copyMatchResult() {
		this.clipboardService.copyFromContent(`${this.selectedLobby.teamOneName} | ${this.selectedLobby.teamOneScore} : ${this.selectedLobby.teamTwoScore} | ${this.selectedLobby.teamTwoName}`);
	}

	/**
	 * Copy the result of the beatmap to the clipboard
	 */
	copyNextPick() {
		const totalMapsPlayed = this.selectedLobby.teamOneScore + this.selectedLobby.teamTwoScore;
		let nextPick = '';

		// First pick goes to .firstPick
		if (totalMapsPlayed % 2 == 0) {
			nextPick = this.selectedLobby.firstPick;
		}
		else {
			nextPick = this.selectedLobby.firstPick == this.selectedLobby.teamOneName ? this.selectedLobby.teamTwoName : this.selectedLobby.teamOneName;
		}

		this.clipboardService.copyFromContent(`Next pick is for ${nextPick}`);
	}

	/**
	 * Send the result of the beatmap to irc if connected
	 */
	sendNextPick() {
		if (this.ircService.getChannelByName(this.selectedLobby.ircChannel) != null) {
			this.ircService.sendMessage(this.selectedLobby.ircChannel, `Next pick is for ${this.selectedLobby.getNextPickName()}`);
		}
	}

	/**
	 * Send the final result to discord
	 */
	sendFinalResult() {
		const scoreString = (this.selectedLobby.teamOneScore > this.selectedLobby.teamTwoScore) ?
			`**Score: ${this.selectedLobby.teamOneName}** | **${this.selectedLobby.teamOneScore}** - ${this.selectedLobby.teamTwoScore} | ${this.selectedLobby.teamTwoName}` :
			`**Score:** ${this.selectedLobby.teamOneName} | ${this.selectedLobby.teamOneScore} - **${this.selectedLobby.teamTwoScore}** | **${this.selectedLobby.teamTwoName}**`;

		let body = {
			"embeds": [
				{
					"title": `Result of **${this.selectedLobby.teamOneName}** vs. **${this.selectedLobby.teamTwoName}**`,
					"description": `${scoreString} \n\n**First pick**: ${this.selectedLobby.firstPick} \n\n[${this.selectedLobby.multiplayerLink}](${this.selectedLobby.multiplayerLink})`,
					"color": 15258703,
					"timestamp": new Date(),
					"footer": {
						"text": `Match referee was ${this.ircService.authenticatedUser}`
					},
					"fields": [
					]
				}
			]
		}

		let teamOneBans: any[] = [],
			teamTwoBans: any[] = [];

		if (this.selectedLobby.teamOneBans.length > 0) {
			for (let ban of this.selectedLobby.teamOneBans) {
				teamOneBans.push(`[${this.getBeatmapnameFromMappools(ban).beatmapName}](${this.getBeatmapnameFromMappools(ban).beatmapUrl})`);
			}

			body.embeds[0].fields.push({
				"name": `**${this.selectedLobby.teamOneName}** bans:`,
				"value": teamOneBans.join('\n'),
				"inline": true
			});

		}

		if (this.selectedLobby.teamTwoBans.length > 0) {
			for (let ban of this.selectedLobby.teamTwoBans) {
				teamTwoBans.push(`[${this.getBeatmapnameFromMappools(ban).beatmapName}](${this.getBeatmapnameFromMappools(ban).beatmapUrl})`);
			}

			body.embeds[0].fields.push({
				"name": `**${this.selectedLobby.teamTwoName}** bans:`,
				"value": teamTwoBans.join('\n'),
				"inline": true
			});
		}

		this.http.post(this.selectedLobby.webhook, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }).subscribe(obj => {
			this.toggleModal();
			this.wbdSelected = false;

			this.wbdWinningTeam = null;
			this.wbdLosingTeam = null;
			this.extraMessage = null;

			this.toastService.addToast(`Successfully send the message to Discord.`);

			console.log(obj);
		});
	}

	/**
	 * Gets called when the webhook changes
	 * @param event
	 */
	changeWebhook(event: any) {
		this.selectedLobby.webhook = event.target.value;
		this.multiplayerLobbies.update(this.selectedLobby);
	}

	/**
	 * Mark the match as valid or invalid so that it counts towards the team score
	 * @param match the match
	 */
	markAsInvalid(match: MultiplayerData) {
		this.selectedLobby.mapsCountTowardScore[match.game_id] = !this.selectedLobby.mapsCountTowardScore[match.game_id];
		this.storeService.set(`lobby.${this.selectedLobby.lobbyId}.countForScore.${match.game_id}`, this.selectedLobby.mapsCountTowardScore[match.game_id]);

		if (this.selectedLobby.mapsCountTowardScore[match.game_id]) {
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
		if (this.selectedLobby.mappool == null) {
			this.selectedLobby.mappool = this.mappoolService.getMappool(this.selectedLobby.mappoolId);

			if (this.selectedLobby.mappool != null) {
				if (this.selectedLobby.mappool.modifiers.hasOwnProperty(beatmapId)) {
					return this.selectedLobby.mappool.modifiers[beatmapId].modifier;
				}
			}
		}
		else {
			if (this.selectedLobby.mappool.modifiers.hasOwnProperty(beatmapId)) {
				return this.selectedLobby.mappool.modifiers[beatmapId].modifier;
			}
		}

		return null;
	}

	/**
	 * Get the cached beatmap if it exists
	 * @param beatmapId the beatmapid
	 */
	getBeatmapname(beatmapId: number) {
		const cachedBeatmap = this.cacheService.getCachedBeatmap(beatmapId);
		return (cachedBeatmap != null) ? cachedBeatmap.name : `Unknown beatmap, synchronize the lobby to get the map name.`;
	}

	/**
	 * Get a beatmap from any given mappool
	 * @param beatmapId the beatmapid
	 */
	getBeatmapnameFromMappools(beatmapId: number): { beatmapName: string, beatmapUrl: string } {
		const cachedBeatmap = this.cacheService.getCachedBeatmapFromMappools(beatmapId);
		return (cachedBeatmap != null) ? cachedBeatmap : null;
	}

	/**
	 * Get the beatmap image
	 * @param beatmapId the beatmapid
	 */
	getThumbUrl(beatmapId: number) {
		const cachedBeatmap = this.cacheService.getCachedBeatmap(beatmapId);
		return (cachedBeatmap != null) ? `url('https://b.ppy.sh/thumb/${cachedBeatmap.beatmapset_id}.jpg')` : ``;
	}

	/**
	 * Get the cached username
	 * @param userId the userid
	 */
	getUsernameFromUserId(userId: number) {
		const cachedUser = this.cacheService.getCachedUser(userId);
		return (cachedUser != null) ? cachedUser.username : "Unknown";
	}

	/**
	 * Get the accuracy of the player in the given slot
	 * @param match the MultiplayerData
	 * @param slotId the slot you want the accuracy from
	 */
	getAccuracy(match: MultiplayerData, slotId: number) {
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

		return (user != undefined) ? this.addDot(user.score % 1 == 0 ? user.score : user.score.toFixed(), " ") : 0;
	}

	/**
	 * Change various settings for the lobby
	 * @param element
	 * @param event
	 */
	change(element: string, event: Event) {
		if (element == 'firstPick') {
			this.selectedLobby.firstPick = (<any>event.currentTarget).value;
		}
		else if (element == 'bestOf') {
			this.selectedLobby.bestOf = (<any>event.currentTarget).value;
		}

		this.multiplayerLobbies.update(this.selectedLobby);
	}

	/**
	 * Split the string
	 * @param nStr the string to split
	 * @param splitter the character to split the string with
	 */
	addDot(nStr, splitter) {
		nStr += '';
		const x = nStr.split('.');
		let x1 = x[0];
		const x2 = x.length > 1 ? '.' + x[1] : '';
		const rgx = /(\d+)(\d{3})/;

		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + splitter + '$2');
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
	 * Toggle the modal to send final result to discord
	 */
	toggleModal() {
		$(`#send-final-result`).modal('toggle');
	}

	/**
	 * Toggle the WBD options
	 */
	toggleWBD() {
		this.wbdSelected = !this.wbdSelected;
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
	 * Send the WBD message to discord
	 */
	sendWinByDefaultResult() {
		let body = {
			"embeds": [
				{
					"title": `Result of **${this.selectedLobby.teamOneName}** vs. **${this.selectedLobby.teamTwoName}**`,
					"description": `**Score:** **${this.wbdWinningTeam}** | 1 - 0 | ${this.wbdLosingTeam} \n\n**${this.wbdLosingTeam}** failed to show up.`,
					"color": 15258703,
					"timestamp": new Date(),
					"footer": {
						"text": `Match referee was ${this.ircService.authenticatedUser}`
					},
					"fields": [
					]
				}
			]
		};

		if (this.extraMessage != null) {
			body.embeds[0].fields.push({
				"name": `**Additional message by ${this.ircService.authenticatedUser}**`,
				"value": this.extraMessage,
			});
		}

		this.http.post(this.selectedLobby.webhook, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }).subscribe(obj => {
			this.toggleModal();
			this.wbdSelected = false;

			this.wbdWinningTeam = null;
			this.wbdLosingTeam = null;
			this.extraMessage = null;

			this.toastService.addToast(`Successfully send the message to Discord.`);

			console.log(obj);
		});
	}
}
