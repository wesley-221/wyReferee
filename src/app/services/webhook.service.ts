import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';
import { CacheBeatmap } from '../models/cache/cache-beatmap';
import { MultiplayerDataUser } from '../models/store-multiplayer/multiplayer-data-user';
import { Lobby } from 'app/models/lobby';
import { WyModBracketMap } from 'app/models/wytournament/mappool/wy-mod-bracket-map';
import { ToastService } from './toast.service';

@Injectable({
	providedIn: 'root'
})
export class WebhookService {
	constructor(private http: HttpClient, private cacheService: CacheService, private toastService: ToastService) { }

	/**
	 * Send final result to discord through a webhook
	 *
	 * @param selectedLobby the lobby to get the data from
	 * @param extraMessage the extra message
	 * @param referee the referee
	 */
	sendFinalResult(selectedLobby: Lobby, extraMessage: string, referee: string) {
		// Dont send webhooks if its disabled
		if (!this.doSendWebhooks(selectedLobby)) {
			return;
		}

		const scoreString = (selectedLobby.teamOneScore > selectedLobby.teamTwoScore) ?
			`**Score:** __${selectedLobby.teamOneName}__ | **${selectedLobby.teamOneScore}** - ${selectedLobby.teamTwoScore} | ${selectedLobby.teamTwoName}` :
			`**Score:** ${selectedLobby.teamOneName} | ${selectedLobby.teamOneScore} - **${selectedLobby.teamTwoScore}** | __${selectedLobby.teamTwoName}__`;

		const body = {
			embeds: [
				{
					title: `${selectedLobby.selectedStage.name}: **${selectedLobby.teamOneName}** vs **${selectedLobby.teamTwoName}**`,
					url: selectedLobby.multiplayerLink,
					description: `${scoreString} \n\n**First pick**: ${selectedLobby.firstPick} \n\n[${selectedLobby.multiplayerLink}](${selectedLobby.multiplayerLink})`,
					color: 15258703,
					timestamp: new Date(),
					footer: {
						text: `Match referee was ${referee}`
					},
					fields: [
					]
				}
			]
		};

		const teamOneBans: any[] = [];
		const teamTwoBans: any[] = [];

		if (selectedLobby.teamOneBans.length > 0) {
			for (const ban of selectedLobby.teamOneBans) {
				for (const modBracket of selectedLobby.mappool.modBrackets) {
					for (const beatmap of modBracket.beatmaps) {
						if (beatmap.beatmapId == ban) {
							teamOneBans.push(`[${beatmap.beatmapName}](${beatmap.beatmapUrl})`);
						}
					}
				}
			}

			body.embeds[0].fields.push({
				name: `**${selectedLobby.teamOneName}** bans:`,
				value: teamOneBans.join('\n'),
				inline: true
			});

		}

		if (selectedLobby.teamTwoBans.length > 0) {
			for (const ban of selectedLobby.teamTwoBans) {
				for (const modBracket of selectedLobby.mappool.modBrackets) {
					for (const beatmap of modBracket.beatmaps) {
						if (beatmap.beatmapId == ban) {
							teamTwoBans.push(`[${beatmap.beatmapName}](${beatmap.beatmapUrl})`);
						}
					}
				}
			}

			body.embeds[0].fields.push({
				name: `**${selectedLobby.teamTwoName}** bans:`,
				value: teamTwoBans.join('\n'),
				inline: true
			});
		}

		if (extraMessage != null) {
			body.embeds[0].fields.push({
				name: `**Additional message by ${referee}**`,
				value: extraMessage,
			});
		}

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.finalResult == true) {
				this.http.post(webhook.url, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }).subscribe(() => {
					this.toastService.addToast('Successfully send the message to Discord.');
				});
			}
		}
	}

	/**
	 * Send win by default message to discord through a webhook
	 *
	 * @param selectedLobby the lobby to get the data from
	 * @param extraMessage the extra message
	 * @param wbdWinningTeam the team that has the win
	 * @param wbdLosingTeam the team that has the loss
	 * @param referee the referee
	 */
	sendWinByDefaultResult(selectedLobby: Lobby, extraMessage: string, wbdWinningTeam: string, wbdLosingTeam: string, referee: string) {
		// Dont send webhooks if its disabled
		if (!this.doSendWebhooks(selectedLobby)) {
			return;
		}

		let resultDescription = `**Score:** __${wbdWinningTeam}__ | 1 - 0 | ${wbdLosingTeam} \n\n__${wbdLosingTeam}__ failed to show up.`;

		if (wbdWinningTeam == 'no-one') {
			resultDescription = `**Score:** ${selectedLobby.teamOneName} | 0 - 0 | ${selectedLobby.teamTwoName} \n\nBoth __${selectedLobby.teamOneName}__ and __${selectedLobby.teamTwoName}__ failed to show up.`;
		}

		const body = {
			embeds: [
				{
					title: `${selectedLobby.selectedStage.name}: **${selectedLobby.teamOneName}** vs **${selectedLobby.teamTwoName}**`,
					description: resultDescription,
					color: 15258703,
					timestamp: new Date(),
					footer: {
						text: `Match referee was ${referee}`
					},
					fields: [
					]
				}
			]
		};

		if (extraMessage != null) {
			body.embeds[0].fields.push({
				name: `**Additional message by ${referee}**`,
				value: extraMessage,
			});
		}

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.finalResult == true) {
				this.http.post(webhook.url, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }).subscribe(() => {
					this.toastService.addToast('Successfully send the message to Discord.');
				});
			}
		}
	}

	/**
	 * Send qualifier lobby message to discord through a webhook
	 *
	 * @param selectedLobby the lobby to get the data from
	 * @param extraMessage the extra message
	 * @param referee the referee
	 */
	sendQualifierResult(selectedLobby: Lobby, extraMessage: string, referee: string) {
		// Dont send webhooks if its disabled
		if (!this.doSendWebhooks(selectedLobby)) {
			return;
		}

		const body = {
			embeds: [
				{
					title: selectedLobby.getQualifierName(),
					description: '',
					url: selectedLobby.multiplayerLink,
					color: 15258703,
					timestamp: new Date(),
					footer: {
						text: `Match referee was ${referee}`
					},
					fields: [
					]
				}
			]
		};

		if (extraMessage != null) {
			body.embeds[0].fields.push({
				name: `**Additional message by ${referee}**`,
				value: extraMessage,
			});
		}

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.finalResult == true) {
				this.http.post(webhook.url, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }).subscribe(() => {
					this.toastService.addToast('Successfully send the message to Discord.');
				});
			}
		}
	}

	/**
	 * Send the ban through a discord webhook
	 *
	 * @param selectedLobby the lobby to get the data from
	 * @param teamName the name of the banner
	 * @param ban the map that was banned
	 * @param referee the referee
	 */
	sendBanResult(selectedLobby: Lobby, teamName: string, ban: WyModBracketMap, referee: string) {
		// Dont send webhooks if its disabled
		if (!this.doSendWebhooks(selectedLobby)) {
			return;
		}

		const body = {
			embeds: [
				{
					title: `🔨 Ban update - ${selectedLobby.teamOneName} vs ${selectedLobby.teamTwoName}`,
					url: selectedLobby.multiplayerLink,
					description: `**${teamName}** has banned [**${ban.beatmapName}**](${ban.beatmapUrl})`,
					color: 15258703,
					timestamp: new Date(),
					footer: {
						text: `Match referee was ${referee}`
					},
					thumbnail: {
						url: `https://b.ppy.sh/thumb/${ban.beatmapsetId}.jpg`
					},
					fields: [
					]
				}
			]
		};

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.bans == true) {
				this.http.post(webhook.url, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }).subscribe();
			}
		}
	}

	/**
	 * Send the result of the last played beatmap to a discord webhook
	 *
	 * @param multiplayerLobby the lobby to get the data from
	 * @param referee the referee
	 */
	sendMatchFinishedResult(multiplayerLobby: Lobby, referee: string) {
		// Dont send webhooks if its disabled
		if (!this.doSendWebhooks(multiplayerLobby)) {
			return;
		}

		const lastMultiplayerData = multiplayerLobby.multiplayerData[multiplayerLobby.multiplayerData.length - 1];

		let cachedBeatmap: CacheBeatmap = null;

		for (const mappool of multiplayerLobby.tournament.mappools) {
			for (const modBracket of mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					if (beatmap.beatmapId == lastMultiplayerData.beatmap_id) {
						cachedBeatmap = new CacheBeatmap({
							name: beatmap.beatmapName,
							beatmapId: beatmap.beatmapId,
							beatmapSetId: beatmap.beatmapsetId,
							beatmapUrl: beatmap.beatmapUrl
						});

						break;
					}
				}
			}
		}

		// Map is a warmup map most likely, skip
		if (cachedBeatmap == null) {
			return;
		}

		let resultString = '';
		let embedHeader = '';
		let lostTheirPick = false;

		// The pick was from team two
		if (multiplayerLobby.getNextPick() == multiplayerLobby.teamOneName) {
			embedHeader += `${multiplayerLobby.teamTwoName} `;

			// Team two has won their pick
			if (lastMultiplayerData.team_two_score > lastMultiplayerData.team_one_score) {
				embedHeader += `won their pick by ${lastMultiplayerData.team_two_score - lastMultiplayerData.team_one_score} points`;
				lostTheirPick = false;
			}
			// Team two has lost their pick
			else {
				embedHeader += `lost their pick by ${lastMultiplayerData.team_one_score - lastMultiplayerData.team_two_score} points`;
				lostTheirPick = true;
			}
		}
		// The pick was from team one
		else {
			embedHeader += `${multiplayerLobby.teamOneName} `;

			// Team one has won their pick
			if (lastMultiplayerData.team_one_score > lastMultiplayerData.team_two_score) {
				embedHeader += `won their pick by ${lastMultiplayerData.team_one_score - lastMultiplayerData.team_two_score} points`;
				lostTheirPick = false;
			}
			// Team one has lost their pick
			else {
				embedHeader += `lost their pick by ${lastMultiplayerData.team_two_score - lastMultiplayerData.team_one_score} points`;
				lostTheirPick = true;
			}
		}

		resultString += `[**${cachedBeatmap.name}**](${cachedBeatmap.beatmapUrl})\n\n`;

		resultString += (multiplayerLobby.teamOneScore > multiplayerLobby.teamTwoScore) ?
			`**Score:** __${multiplayerLobby.teamOneName}__ | **${multiplayerLobby.teamOneScore}** - ${multiplayerLobby.teamTwoScore} | ${multiplayerLobby.teamTwoName}\n\n` :
			`**Score:** ${multiplayerLobby.teamOneName} | ${multiplayerLobby.teamOneScore} - **${multiplayerLobby.teamTwoScore}** | __${multiplayerLobby.teamTwoName}__\n\n`;

		let highestScorePlayer: MultiplayerDataUser = new MultiplayerDataUser();
		let highestAccuracyPlayer: MultiplayerDataUser = new MultiplayerDataUser();

		for (const user of lastMultiplayerData.getPlayers()) {
			if (user != null && user != undefined) {
				// Cast score and accuracy to actual int and float to prevent string comparison
				user.score = parseInt(user.score as any);
				user.accuracy = parseFloat(user.accuracy as any);

				if (user.score > highestScorePlayer.score) {
					highestScorePlayer = user;
				}

				if (user.accuracy > highestAccuracyPlayer.accuracy) {
					highestAccuracyPlayer = user;
				}
			}
		}

		const highestScorePlayerName = this.cacheService.getCachedUser(highestScorePlayer.user).username;
		const highestAccuracyPlayerName = this.cacheService.getCachedUser(highestAccuracyPlayer.user).username;

		resultString += `**MVP score**: __${highestScorePlayerName}__ with ${highestScorePlayer.score} points and ${highestScorePlayer.accuracy}% accuracy\n`;
		resultString += `**MVP accuracy**: __${highestAccuracyPlayerName}__ with ${highestAccuracyPlayer.score} points and ${highestAccuracyPlayer.accuracy}% accuracy\n\n`;

		resultString += `Next pick is for __${multiplayerLobby.getNextPick()}__`;

		const body = {
			embeds: [
				{
					title: `🏁 ${embedHeader}`,
					url: multiplayerLobby.multiplayerLink,
					description: resultString,
					color: lostTheirPick ? 0xad324f : 0x32a852,
					timestamp: new Date(),
					thumbnail: {
						url: `https://b.ppy.sh/thumb/${cachedBeatmap.beatmapSetId}.jpg`
					},
					footer: {
						text: `Match referee was ${referee}`
					},
					fields: [
					]
				}
			]
		};

		for (const webhook of multiplayerLobby.tournament.webhooks) {
			if (webhook.matchResult == true) {
				this.http.post(webhook.url, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }).subscribe();
			}
		}
	}

	/**
	 * Send the multiplayer lobby details through a discord webhook
	 *
	 * @param selectedLobby the lobby to get the data from
	 * @param referee the referee
	 */
	sendMatchCreation(selectedLobby: Lobby, referee: string): void {
		// Dont send webhooks if its disabled
		if (!this.doSendWebhooks(selectedLobby)) {
			return;
		}

		const body = {
			embeds: [
				{
					title: `Multiplayer lobby - ${selectedLobby.teamOneName} vs ${selectedLobby.teamTwoName}`,
					url: selectedLobby.multiplayerLink,
					color: 15258703,
					timestamp: new Date(),
					footer: {
						text: `Match referee was ${referee}`
					},
					fields: [
						{
							name: 'Twitch multiplayer link command',
							value: `\`!editcom !mp ${selectedLobby.teamOneName} vs ${selectedLobby.teamTwoName}: ${selectedLobby.multiplayerLink}\``
						},
						{
							name: 'Twitch stream title command',
							value: `\`!title ${selectedLobby.tournament.name} - ${selectedLobby.selectedStage.name}: ${selectedLobby.teamOneName} vs ${selectedLobby.teamTwoName}\``
						}
					]
				}
			]
		};

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.matchCreation == true) {
				this.http.post(webhook.url, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }).subscribe();
			}
		}
	}

	/**
	 * Send the picked beatmap through a discord webhook
	 *
	 * @param selectedLobby the lobby to get the data from
	 * @param referee the referee
	 * @param teamName the team that picked the map
	 * @param pick the picked map
	 */
	sendBeatmapPicked(selectedLobby: Lobby, referee: string, teamName: string, pick: WyModBracketMap): void {
		// Dont send webhooks if its disabled
		if (!this.doSendWebhooks(selectedLobby)) {
			return;
		}

		const body = {
			embeds: [
				{
					title: `📌 Pick update - ${selectedLobby.teamOneName} vs ${selectedLobby.teamTwoName}`,
					url: selectedLobby.multiplayerLink,
					description: `**${teamName}** has picked [**${pick.beatmapName}**](${pick.beatmapUrl})`,
					color: 15258703,
					timestamp: new Date(),
					footer: {
						text: `Match referee was ${referee}`
					},
					thumbnail: {
						url: `https://b.ppy.sh/thumb/${pick.beatmapsetId}.jpg`
					},
					fields: [
					]
				}
			]
		};

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.picks == true) {
				this.http.post(webhook.url, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }).subscribe();
			}
		}
	}

	/**
	 * Check if webhooks are supposed to be sent
	 *
	 * @param lobby the lobby to check
	 */
	private doSendWebhooks(lobby: Lobby): boolean {
		return !(lobby.sendWebhooks == null || lobby.sendWebhooks == undefined || lobby.sendWebhooks == false);
	}

	/**
	 * Get a beatmap from any given mappool
	 *
	 * @param beatmapId the beatmapid
	 */
	private getBeatmapnameFromMappools(beatmapId: number): CacheBeatmap {
		const cachedBeatmap = this.cacheService.getCachedBeatmapFromMappools(beatmapId);
		return (cachedBeatmap != null) ? cachedBeatmap : null;
	}
}
