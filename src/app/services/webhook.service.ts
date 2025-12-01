import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { MultiplayerDataUser } from '../models/store-multiplayer/multiplayer-data-user';
import { Lobby } from 'app/models/lobby';
import { WyModBracketMap } from 'app/models/wytournament/mappool/wy-mod-bracket-map';
import { ToastService } from './toast.service';
import { WebhookStoreService } from './storage/webhook-store.service';
import { filter, take } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WebhookService {
	authorImage: string;
	authorName: string;
	bottomImage: string;
	footerIconUrl: string;
	footerText: string;

	constructor(private cacheService: CacheService, private toastService: ToastService, private webhookStore: WebhookStoreService) {
		webhookStore
			.watchWebhookSettings()
			.pipe(
				filter(webhookStore => webhookStore != null),
				take(1)
			)
			.subscribe(webhookStore => {
				this.authorImage = webhookStore.authorImage;
				this.authorName = webhookStore.authorName;
				this.bottomImage = webhookStore.bottomImage;
				this.footerIconUrl = webhookStore.footerIconUrl;
				this.footerText = webhookStore.footerText;
			});
	}

	/**
	 * Update the webhook customizations
	 */
	updateWebhookCustomization(authorImage: string, authorName: string, bottomImage: string, footerIconUrl: string, footerText: string): void {
		const fields = [
			{ key: 'authorImage', value: authorImage, property: 'authorImage' },
			{ key: 'authorName', value: authorName, property: 'authorName' },
			{ key: 'bottomImage', value: bottomImage, property: 'bottomImage' },
			{ key: 'footerIconUrl', value: footerIconUrl, property: 'footerIconUrl' },
			{ key: 'footerText', value: footerText, property: 'footerText' }
		];

		fields.forEach(field => {
			this.webhookStore.set(field.key, field.value);
			this[field.property] = field.value;
		});
	}

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

		const scoreString = (selectedLobby.getTeamOneScore() > selectedLobby.getTeamTwoScore()) ?
			`**Score:** __${this.escape(selectedLobby.teamOneName)}__ | **${selectedLobby.getTeamOneScore()}** - ${selectedLobby.getTeamTwoScore()} | ${this.escape(selectedLobby.teamTwoName)}` :
			`**Score:** ${this.escape(selectedLobby.teamOneName)} | ${selectedLobby.getTeamOneScore()} - **${selectedLobby.getTeamTwoScore()}** | __${this.escape(selectedLobby.teamTwoName)}__`;

		const body = {
			embeds: [
				{
					title: `${selectedLobby.selectedStage.name}: **${this.escape(selectedLobby.teamOneName)}** vs. **${this.escape(selectedLobby.teamTwoName)}**`,
					url: selectedLobby.multiplayerLink,
					description: `${scoreString} \n\n**First pick**: ${selectedLobby.firstPick} \n\n${selectedLobby.multiplayerLink}`,
					color: 15258703,
					footer: {
						text: `Match referee was ${this.escape(referee)}`
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
				name: `**${this.escape(selectedLobby.teamOneName)}** bans:`,
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
				name: `**${this.escape(selectedLobby.teamTwoName)}** bans:`,
				value: teamTwoBans.join('\n'),
				inline: true
			});
		}

		if (extraMessage != null) {
			body.embeds[0].fields.push({
				name: `**Additional message by ${this.escape(referee)}**`,
				value: extraMessage,
			});
		}

		this.setCustomizedFields(body, true);

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.finalResult == true) {
				window.electronApi.webhook.sendWebhook(webhook.url, body).then(() => {
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

		let resultDescription = `**Score:** __${this.escape(wbdWinningTeam)}__ | 1 - 0 | ${this.escape(wbdLosingTeam)} \n\n__${this.escape(wbdLosingTeam)}__ failed to show up.`;

		if (wbdWinningTeam == 'no-one') {
			resultDescription = `**Score:** ${this.escape(selectedLobby.teamOneName)} | 0 - 0 | ${this.escape(selectedLobby.teamTwoName)} \n\nBoth __${this.escape(selectedLobby.teamOneName)}__ and __${this.escape(selectedLobby.teamTwoName)}__ failed to show up.`;
		}

		const body = {
			embeds: [
				{
					title: `${selectedLobby.selectedStage.name}: **${this.escape(selectedLobby.teamOneName)}** vs. **${this.escape(selectedLobby.teamTwoName)}**`,
					description: resultDescription,
					color: 15258703,
					footer: {
						text: `Match referee was ${this.escape(referee)}`
					},
					fields: [
					]
				}
			]
		};

		if (extraMessage != null) {
			body.embeds[0].fields.push({
				name: `**Additional message by ${this.escape(referee)}**`,
				value: extraMessage,
			});
		}

		this.setCustomizedFields(body, false);

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.finalResult == true) {
				window.electronApi.webhook.sendWebhook(webhook.url, body).then(() => {
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
					footer: {
						text: `Match referee was ${this.escape(referee)}`
					},
					fields: [
					]
				}
			]
		};

		if (extraMessage != null) {
			body.embeds[0].fields.push({
				name: `**Additional message by ${this.escape(referee)}**`,
				value: extraMessage,
			});
		}

		this.setCustomizedFields(body, true);

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.finalResult == true) {
				window.electronApi.webhook.sendWebhook(webhook.url, body).then(() => {
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
					title: `🔨 Ban update - ${this.escape(selectedLobby.teamOneName)} vs. ${this.escape(selectedLobby.teamTwoName)}`,
					url: selectedLobby.multiplayerLink,
					description: `**${this.escape(teamName)}** has banned [**${ban.beatmapName}**](${ban.beatmapUrl})`,
					color: 15258703,
					footer: {
						text: `Match referee was ${this.escape(referee)}`
					},
					thumbnail: {
						url: `https://b.ppy.sh/thumb/${ban.beatmapsetId}.jpg`
					},
					fields: [
					]
				}
			]
		};

		this.setCustomizedFields(body, false);

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.bans == true) {
				window.electronApi.webhook.sendWebhook(webhook.url, body);
			}
		}
	}

	/**
	 * Send the protect through a discord webhook
	 *
	 * @param selectedLobby the lobby to get the data from
	 * @param teamName the name of the banner
	 * @param protect the map that was protected
	 * @param referee the referee
	 */
	sendProtectResult(selectedLobby: Lobby, teamName: string, protect: WyModBracketMap, referee: string) {
		// Dont send webhooks if its disabled
		if (!this.doSendWebhooks(selectedLobby)) {
			return;
		}

		const body = {
			embeds: [
				{
					title: `🛡 Protect update - ${this.escape(selectedLobby.teamOneName)} vs. ${this.escape(selectedLobby.teamTwoName)}`,
					url: selectedLobby.multiplayerLink,
					description: `**${this.escape(teamName)}** has protected [**${protect.beatmapName}**](${protect.beatmapUrl})`,
					color: 15258703,
					footer: {
						text: `Match referee was ${this.escape(referee)}`
					},
					thumbnail: {
						url: `https://b.ppy.sh/thumb/${protect.beatmapsetId}.jpg`
					},
					fields: [
					]
				}
			]
		};

		this.setCustomizedFields(body, false);

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.bans == true) {
				window.electronApi.webhook.sendWebhook(webhook.url, body);
			}
		}
	}

	/**
	 * Send a summary of the match through a discord webhook
	 *
	 * @param selectedLobby the lobby to get the data from
	 * @param referee the referee that is running the lobby
	 */
	sendMatchSummary(selectedLobby: Lobby, referee: string) {
		if (!this.doSendWebhooks(selectedLobby)) {
			return;
		}

		const teamOneBans = [];
		const teamTwoBans = [];

		for (const ban of selectedLobby.teamOneBans) {
			teamOneBans.push(selectedLobby.tournament.getBeatmapForMatchSummary(ban));
		}

		for (const ban of selectedLobby.teamTwoBans) {
			teamTwoBans.push(selectedLobby.tournament.getBeatmapForMatchSummary(ban));
		}

		const firstPickTeam = selectedLobby.firstPick == selectedLobby.teamOneName ? 1 : 2;
		const teamOneLength = selectedLobby.teamOnePicks.length;
		const teamTwoLength = selectedLobby.teamTwoPicks.length;
		const maxLength = Math.max(teamOneLength, teamTwoLength);

		const picks: string[] = [];

		for (let i = 0; i < maxLength; i++) {
			if (firstPickTeam === 1) {
				if (i < teamOneLength) {
					const teamOnePick = selectedLobby.teamOnePicks[i];
					picks.push(`${selectedLobby.tournament.getBeatmapForMatchSummary(teamOnePick)} was picked by **${this.escape(selectedLobby.teamOneName)}**`);
				}
				if (i < teamTwoLength) {
					const teamTwoPick = selectedLobby.teamTwoPicks[i];
					picks.push(`${selectedLobby.tournament.getBeatmapForMatchSummary(teamTwoPick)} was picked by **${this.escape(selectedLobby.teamTwoName)}**`);
				}
			} else if (firstPickTeam === 2) {
				if (i < teamTwoLength) {
					const teamTwoPick = selectedLobby.teamTwoPicks[i];
					picks.push(`${selectedLobby.tournament.getBeatmapForMatchSummary(teamTwoPick)} was picked by **${this.escape(selectedLobby.teamTwoName)}**`);
				}
				if (i < teamOneLength) {
					const teamOnePick = selectedLobby.teamOnePicks[i];
					picks.push(`${selectedLobby.tournament.getBeatmapForMatchSummary(teamOnePick)} was picked by **${this.escape(selectedLobby.teamOneName)}**`);
				}
			}
		}

		const body = {
			embeds: [
				{
					title: `Match summary - ${this.escape(selectedLobby.teamOneName)} vs. ${this.escape(selectedLobby.teamTwoName)}`,
					url: selectedLobby.multiplayerLink,
					color: 15258703,
					footer: {
						text: `Match referee was ${this.escape(referee)}`
					},
					fields: [
					]
				}
			]
		};

		body.embeds[0].fields.push(
			{
				name: `${this.escape(selectedLobby.teamOneName)} bans`,
				value: teamOneBans.join('\n'),
				inline: true
			},
			{
				name: `${this.escape(selectedLobby.teamTwoName)} bans`,
				value: teamTwoBans.join('\n'),
				inline: true
			});

		body.embeds[0].fields.push(
			{
				name: 'Match picks',
				value: picks.join('\n')
			});

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.matchSummary == true) {
				window.electronApi.webhook.sendWebhook(webhook.url, body);
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

		let foundBeatmap: WyModBracketMap = null;

		for (const mappool of multiplayerLobby.tournament.mappools) {
			for (const modBracket of mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					if (beatmap.beatmapId == lastMultiplayerData.beatmap_id) {
						foundBeatmap = WyModBracketMap.makeTrueCopy(beatmap);

						break;
					}
				}
			}
		}

		// Map is a warmup map most likely, skip
		if (foundBeatmap == null) {
			return;
		}

		let resultString = '';
		let embedHeader = '';
		let lostTheirPick = false;

		let isReverseScoreBeatMap = false;

		if (multiplayerLobby.tournament && multiplayerLobby.mappool) {
			for (const modBracket of multiplayerLobby.mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					if (beatmap.beatmapId == foundBeatmap.beatmapId && foundBeatmap.reverseScore == true) {
						isReverseScoreBeatMap = true;
						break;
					}
				}
			}
		}

		// The pick was from team two
		if (multiplayerLobby.getNextPick() == multiplayerLobby.teamOneName) {
			embedHeader += `${this.escape(multiplayerLobby.teamTwoName)} `;

			if (isReverseScoreBeatMap == true) {
				// Team two has won their pick
				if (lastMultiplayerData.team_one_score > lastMultiplayerData.team_two_score) {
					embedHeader += `won their pick by ${lastMultiplayerData.team_one_score - lastMultiplayerData.team_two_score} points`;
					lostTheirPick = false;
				}
				// Team two has lost their pick
				else {
					embedHeader += `lost their pick by ${lastMultiplayerData.team_two_score - lastMultiplayerData.team_one_score} points`;
					lostTheirPick = true;
				}
			}
			else {
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
		}
		// The pick was from team one
		else {
			embedHeader += `${this.escape(multiplayerLobby.teamOneName)} `;

			if (isReverseScoreBeatMap == true) {
				// Team one has won their pick
				if (lastMultiplayerData.team_two_score > lastMultiplayerData.team_one_score) {
					embedHeader += `won their pick by ${lastMultiplayerData.team_two_score - lastMultiplayerData.team_one_score} points`;
					lostTheirPick = false;
				}
				// Team one has lost their pick
				else {
					embedHeader += `lost their pick by ${lastMultiplayerData.team_one_score - lastMultiplayerData.team_two_score} points`;
					lostTheirPick = true;
				}
			}
			else {
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
		}

		resultString += `[**${foundBeatmap.beatmapName}**](${foundBeatmap.beatmapUrl})\n\n`;

		let winner = null;

		if (isReverseScoreBeatMap == true) {
			winner = multiplayerLobby.getTeamTwoScore() > multiplayerLobby.getTeamOneScore() ? 1 : 2;
		}
		else {
			winner = multiplayerLobby.getTeamOneScore() > multiplayerLobby.getTeamTwoScore() ? 1 : 2;
		}

		resultString += (winner == 1) ?
			`**Score:** __${this.escape(multiplayerLobby.teamOneName)}__ | **${multiplayerLobby.getTeamOneScore()}** - ${multiplayerLobby.getTeamTwoScore()} | ${this.escape(multiplayerLobby.teamTwoName)}\n\n` :
			`**Score:** ${this.escape(multiplayerLobby.teamOneName)} | ${multiplayerLobby.getTeamOneScore()} - **${multiplayerLobby.getTeamTwoScore()}** | __${this.escape(multiplayerLobby.teamTwoName)}__\n\n`;

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

		resultString += `**MVP score**: __${this.escape(highestScorePlayerName)}__ with ${highestScorePlayer.score} points and ${highestScorePlayer.accuracy}% accuracy\n`;
		resultString += `**MVP accuracy**: __${this.escape(highestAccuracyPlayerName)}__ with ${highestAccuracyPlayer.score} points and ${highestAccuracyPlayer.accuracy}% accuracy\n\n`;

		resultString += `Next pick is for __${this.escape(multiplayerLobby.getNextPick())}__`;

		const body = {
			embeds: [
				{
					title: `🏁 ${embedHeader}`,
					url: multiplayerLobby.multiplayerLink,
					description: resultString,
					color: lostTheirPick ? 0xad324f : 0x32a852,
					thumbnail: {
						url: `https://b.ppy.sh/thumb/${foundBeatmap.beatmapsetId}.jpg`
					},
					footer: {
						text: `Match referee was ${referee}`
					},
					fields: [
					]
				}
			]
		};

		this.setCustomizedFields(body, false);

		for (const webhook of multiplayerLobby.tournament.webhooks) {
			if (webhook.matchResult == true) {
				window.electronApi.webhook.sendWebhookMainOnly(webhook.url, body);
			}
		}
	}

	/**
	 * Send the multiplayer lobby details through a discord webhook
	 *
	 * @param selectedLobby the lobby to get the data from
	 * @param referee the referee
	 */
	sendMatchCreation(selectedLobby: Lobby, referee: string, streamerList?: string[], commentatorList?: string[]): void {
		// Dont send webhooks if its disabled
		if (!this.doSendWebhooks(selectedLobby, true)) {
			return;
		}

		const body = {
			embeds: [
				{
					title: '',
					url: selectedLobby.multiplayerLink,
					color: 15258703,
					footer: {
						text: `Match referee was ${this.escape(referee)}`
					},
					fields: []
				}
			]
		};

		if (selectedLobby.isQualifierLobby == true) {
			body.embeds[0].title = `Multiplayer lobby - ${selectedLobby.description}`;

			body.embeds[0].fields.push(
				{
					name: 'Twitch multiplayer link command',
					value: `\`!editcom !mp ${selectedLobby.tournament.name}: ${selectedLobby.description}\``
				},
				{
					name: 'Twitch stream title command',
					value: `\`!title ${selectedLobby.tournament.name}: ${selectedLobby.description}\``
				});
		}
		else {
			body.embeds[0].title = `Multiplayer lobby - ${this.escape(selectedLobby.teamOneName)} vs. ${this.escape(selectedLobby.teamTwoName)}`;

			body.embeds[0].fields.push(
				{
					name: 'Twitch multiplayer link command',
					value: `\`!editcom !mp ${selectedLobby.teamOneName} vs. ${selectedLobby.teamTwoName}: ${selectedLobby.multiplayerLink}\``
				},
				{
					name: 'Twitch stream title command',
					value: `\`!title ${selectedLobby.tournament.name} - ${selectedLobby.selectedStage.name}: ${selectedLobby.teamOneName} vs. ${selectedLobby.teamTwoName}\``
				});

			if (streamerList != null && streamerList.length > 0) {
				const streamers = streamerList.length == 1 ? streamerList[0] : streamerList.join(' and ');

				body.embeds[0].fields.push(
					{
						name: 'Twitch streamer command',
						value: `\`!editcom !streamer Streaming this match is ${streamers}\``
					});
			}
			else {
				body.embeds[0].fields.push(
					{
						name: 'Twitch streamer command',
						value: `\`!editcom !streamer No streamers available for this match\``
					});
			}

			if (commentatorList != null && commentatorList.length > 0) {
				const casters = commentatorList.length == 1 ? commentatorList[0] : commentatorList.join(' and ');

				body.embeds[0].fields.push(
					{
						name: 'Twitch casters command',
						value: `\`!editcom !casters Casting this match is ${casters}\``
					});
			}
			else {
				body.embeds[0].fields.push(
					{
						name: 'Twitch casters command',
						value: `\`!editcom !casters No casters available for this\``
					});
			}
		}

		this.setCustomizedFields(body, false);

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.matchCreation == true) {
				window.electronApi.webhook.sendWebhook(webhook.url, body);
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

		// Dont send webhook if its a qualifier lobby
		if (selectedLobby.isQualifierLobby == true) {
			return;
		}

		const body = {
			embeds: [
				{
					title: `📌 Pick update - ${this.escape(selectedLobby.teamOneName)} vs. ${this.escape(selectedLobby.teamTwoName)}`,
					url: selectedLobby.multiplayerLink,
					description: `**${teamName}** has picked [**${pick.beatmapName}**](${pick.beatmapUrl})`,
					color: 15258703,
					footer: {
						text: `Match referee was ${this.escape(referee)}`
					},
					thumbnail: {
						url: `https://b.ppy.sh/thumb/${pick.beatmapsetId}.jpg`
					},
					fields: [
					]
				}
			]
		};

		this.setCustomizedFields(body, false);

		for (const webhook of selectedLobby.tournament.webhooks) {
			if (webhook.picks == true) {
				window.electronApi.webhook.sendWebhook(webhook.url, body);
			}
		}
	}


	/**
	 * Escape a string so it is safe to use inside of the webhook
	 *
	 * @param content the content to escape
	 */
	private escape(content: string): string {
		return content
			.replace(/\*/g, '\\*')
			.replace(/_/g, '\\_')
			.replace(/~/g, '\\~')
			.replace(/`/g, '\\`')
			.replace(/\|/g, '\\|')
			.replace(/>/g, '\\>');
	}

	/**
	 * Check if webhooks are supposed to be sent
	 *
	 * @param lobby the lobby to check
	 */
	private doSendWebhooks(lobby: Lobby, matchCreation?: boolean): boolean {
		if (lobby.sendWebhooks == null || lobby.sendWebhooks == undefined || lobby.sendWebhooks == false) {
			return false;
		}

		if (lobby.isQualifierLobby == true) {
			if (matchCreation == true) {
				return true;
			}
			else {
				return false;
			}
		}

		return true;
	}

	/**
	 * Set the various customized fields if setup by the user
	 *
	 * @param embed the embed to add the customized fields to
	 */
	private setCustomizedFields(embed: any, useBottomImage: boolean) {
		const isUndefined = ['', null, undefined];

		if (!isUndefined.includes(this.authorImage)) {
			embed.avatar_url = this.authorImage;
		}

		if (!isUndefined.includes(this.authorName)) {
			embed.username = this.authorName;
		}

		if (!isUndefined.includes(this.bottomImage) && useBottomImage == true) {
			if (!embed.embeds[0].hasOwnProperty('image')) {
				embed.embeds[0].image = {};
			}

			embed.embeds[0].image.url = this.bottomImage;
		}

		if (!isUndefined.includes(this.footerIconUrl)) {
			if (!embed.embeds[0].hasOwnProperty('footer')) {
				embed.embeds[0].footer = {};
			}

			embed.embeds[0].footer.icon_url = this.footerIconUrl;
		}

		if (!isUndefined.includes(this.footerText)) {
			if (!embed.embeds[0].hasOwnProperty('footer')) {
				embed.embeds[0].footer = {};
			}

			embed.embeds[0].footer.text = this.footerText;
		}
	}
}
