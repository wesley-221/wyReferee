import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MultiplayerLobby } from '../models/store-multiplayer/multiplayer-lobby';
import { CacheService } from './cache.service';
import { ModBracketMap } from '../models/osu-mappool/mod-bracket-map';
import { CacheBeatmap } from '../models/cache/cache-beatmap';
import { MultiplayerDataUser } from '../models/store-multiplayer/multiplayer-data-user';

@Injectable({
	providedIn: 'root'
})
export class WebhookService {
	constructor(private http: HttpClient, private cacheService: CacheService) { }

	/**
	 * Get a beatmap from any given mappool
	 * @param beatmapId the beatmapid
	 */
	private getBeatmapnameFromMappools(beatmapId: number): CacheBeatmap {
		const cachedBeatmap = this.cacheService.getCachedBeatmapFromMappools(beatmapId);
		return (cachedBeatmap != null) ? cachedBeatmap : null;
	}

	/**
	 * Send final result to discord through a webhook
	 * @param selectedLobby the lobby to get the data from
	 * @param extraMessage the extra message
	 * @param referee the referee
	 */
	sendFinalResult(selectedLobby: MultiplayerLobby, extraMessage: String, referee: String) {
		const scoreString = (selectedLobby.teamOneScore > selectedLobby.teamTwoScore) ?
			`**Score: ${selectedLobby.teamOneName}** | **${selectedLobby.teamOneScore}** - ${selectedLobby.teamTwoScore} | ${selectedLobby.teamTwoName}` :
			`**Score:** ${selectedLobby.teamOneName} | ${selectedLobby.teamOneScore} - **${selectedLobby.teamTwoScore}** | **${selectedLobby.teamTwoName}**`;

		let body = {
			"embeds": [
				{
					"title": `Result of **${selectedLobby.teamOneName}** vs. **${selectedLobby.teamTwoName}**`,
					"url": selectedLobby.multiplayerLink,
					"description": `${scoreString} \n\n**First pick**: ${selectedLobby.firstPick} \n\n[${selectedLobby.multiplayerLink}](${selectedLobby.multiplayerLink})`,
					"color": 15258703,
					"timestamp": new Date(),
					"footer": {
						"text": `Match referee was ${referee}`
					},
					"fields": [
					]
				}
			]
		}

		let teamOneBans: any[] = [],
			teamTwoBans: any[] = [];

		if (selectedLobby.teamOneBans.length > 0) {
			for (let ban of selectedLobby.teamOneBans) {
				teamOneBans.push(`[${this.getBeatmapnameFromMappools(ban).name}](${this.getBeatmapnameFromMappools(ban).beatmapUrl})`);
			}

			body.embeds[0].fields.push({
				"name": `**${selectedLobby.teamOneName}** bans:`,
				"value": teamOneBans.join('\n'),
				"inline": true
			});

		}

		if (selectedLobby.teamTwoBans.length > 0) {
			for (let ban of selectedLobby.teamTwoBans) {
				teamTwoBans.push(`[${this.getBeatmapnameFromMappools(ban).name}](${this.getBeatmapnameFromMappools(ban).beatmapUrl})`);
			}

			body.embeds[0].fields.push({
				"name": `**${selectedLobby.teamTwoName}** bans:`,
				"value": teamTwoBans.join('\n'),
				"inline": true
			});
		}

		if (extraMessage != null) {
			body.embeds[0].fields.push({
				"name": `**Additional message by ${referee}**`,
				"value": extraMessage,
			});
		}

		return this.http.post(selectedLobby.webhook, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) });
	}

	/**
	 * Send win by default message to discord through a webhook
	 * @param selectedLobby the lobby to get the data from
	 * @param extraMessage the extra message
	 * @param wbdWinningTeam the team that has the win
	 * @param wbdLosingTeam the team that has the loss
	 * @param referee the referee
	 */
	sendWinByDefaultResult(selectedLobby: MultiplayerLobby, extraMessage: String, wbdWinningTeam: String, wbdLosingTeam: String, referee: String) {
		let resultDescription = `**Score:** **${wbdWinningTeam}** | 1 - 0 | ${wbdLosingTeam} \n\n**${wbdLosingTeam}** failed to show up.`;

		if (wbdWinningTeam == "No-one") {
			resultDescription = `**Score:** ${selectedLobby.teamOneName} | 0 - 0 | ${selectedLobby.teamTwoName} \n\nBoth **${selectedLobby.teamOneName}** and **${selectedLobby.teamTwoName}** failed to show up.`;
		}

		let body = {
			"embeds": [
				{
					"title": `Result of **${selectedLobby.teamOneName}** vs. **${selectedLobby.teamTwoName}**`,
					"description": resultDescription,
					"color": 15258703,
					"timestamp": new Date(),
					"footer": {
						"text": `Match referee was ${referee}`
					},
					"fields": [
					]
				}
			]
		};

		if (extraMessage != null) {
			body.embeds[0].fields.push({
				"name": `**Additional message by ${referee}**`,
				"value": extraMessage,
			});
		}

		return this.http.post(selectedLobby.webhook, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) });
	}

	/**
	 * Send the ban through a discord webhook
	 * @param selectedLobby the lobby to get the data from
	 * @param teamName the name of the banner
	 * @param ban the map that was banned
	 * @param referee the referee
	 */
	sendBanResult(selectedLobby: MultiplayerLobby, teamName: String, ban: ModBracketMap, referee: String) {
		const cachedBeatmap = this.cacheService.getCachedBeatmapFromMappools(ban.beatmapId);

		let body = {
			"embeds": [
				{
					"title": `🔨 Ban update - ${selectedLobby.teamOneName} vs ${selectedLobby.teamTwoName}`,
					"url": selectedLobby.multiplayerLink,
					"description": `**${teamName}** has banned [**${ban.beatmapName}**](${ban.beatmapUrl})`,
					"color": 15258703,
					"timestamp": new Date(),
					"footer": {
						"text": `Match referee was ${referee}`
					},
					"thumbnail": {
						"url": `https://b.ppy.sh/thumb/${cachedBeatmap.beatmapSetId}.jpg`
					},
					"fields": [
					]
				}
			]
		};

		return this.http.post(selectedLobby.webhook, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) });
	}

	/**
	 * Send the pick through a discord webhook
	 * @param selectedLobby the lobby to get the data from
	 * @param beatmap the beatmap that was picked
	 * @param referee the referee
	 */
	sendPickResult(selectedLobby: MultiplayerLobby, beatmap: ModBracketMap, referee: String) {
		const cachedBeatmap = this.cacheService.getCachedBeatmapFromMappools(beatmap.beatmapId);

		let body = {
			"embeds": [
				{
					"title": `📌 Pick update  - ${selectedLobby.teamOneName} vs ${selectedLobby.teamTwoName}`,
					"url": selectedLobby.multiplayerLink,
					"description": `**${selectedLobby.getNextPickName()}** has picked [**${beatmap.beatmapName}**](${beatmap.beatmapUrl})`,
					"color": 15258703,
					"timestamp": new Date(),
					"footer": {
						"text": `Match referee was ${referee}`
					},
					"thumbnail": {
						"url": `https://b.ppy.sh/thumb/${cachedBeatmap.beatmapSetId}.jpg`
					},
					"fields": [
					]
				}
			]
		};

		return this.http.post(selectedLobby.webhook, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) });
	}

	/**
	 * Send the result of the last played beatmap to a discord webhook
	 * @param multiplayerLobby the lobby to get the data from
	 * @param referee the referee
	 */
	sendMatchFinishedResult(multiplayerLobby: MultiplayerLobby, referee: String) {
		const lastMultiplayerData = multiplayerLobby.multiplayerData[multiplayerLobby.multiplayerData.length - 1];
		const cachedBeatmap = this.cacheService.getCachedBeatmapFromMappools(lastMultiplayerData.beatmap_id);

		// Map is a warmup map most likely, skip
		if (cachedBeatmap == null) {
			return null;
		}

		let resultString = (lastMultiplayerData.team_one_score > lastMultiplayerData.team_two_score) ?
			`**${multiplayerLobby.teamOneName}** has won on [**${cachedBeatmap.name}**](${cachedBeatmap.beatmapUrl})!\n\n` :
			`**${multiplayerLobby.teamTwoName}** has won on [**${cachedBeatmap.name}**](${cachedBeatmap.beatmapUrl})!\n\n`;

		resultString += (multiplayerLobby.teamOneScore > multiplayerLobby.teamTwoScore) ?
			`**Score: ${multiplayerLobby.teamOneName}** | **${multiplayerLobby.teamOneScore}** - ${multiplayerLobby.teamTwoScore} | ${multiplayerLobby.teamTwoName}\n\n` :
			`**Score:** ${multiplayerLobby.teamOneName} | ${multiplayerLobby.teamOneScore} - **${multiplayerLobby.teamTwoScore}** | **${multiplayerLobby.teamTwoName}**\n\n`;

		let highestScorePlayer: MultiplayerDataUser = null;
		let highestAccuracyPlayer: MultiplayerDataUser = null;

		for (let user of lastMultiplayerData.getPlayers()) {
			if (highestScorePlayer == null || user.score > highestScorePlayer.score) {
				highestScorePlayer = user;
			}

			if (highestAccuracyPlayer == null || user.accuracy > highestAccuracyPlayer.accuracy) {
				highestAccuracyPlayer = user;
			}
		}

		const highestScorePlayerName = this.cacheService.getCachedUser(highestScorePlayer.user).username;
		const highestAccuracyPlayerName = this.cacheService.getCachedUser(highestAccuracyPlayer.user).username;

		resultString += `**MVP score**: __${highestScorePlayerName}__ with ${highestScorePlayer.score} points and ${highestScorePlayer.accuracy}% accuracy\n`;
		resultString += `**MVP accuracy**: __${highestAccuracyPlayerName}__ with ${highestAccuracyPlayer.score} points and ${highestAccuracyPlayer.accuracy}% accuracy`;

		let body = {
			"embeds": [
				{
					"title": `🏁 Beatmap result update  - ${multiplayerLobby.teamOneName} vs ${multiplayerLobby.teamTwoName}`,
					"url": multiplayerLobby.multiplayerLink,
					"description": resultString,
					"color": 15258703,
					"timestamp": new Date(),
					"thumbnail": {
						"url": `https://b.ppy.sh/thumb/${cachedBeatmap.beatmapSetId}.jpg`
					},
					"footer": {
						"text": `Match referee was ${referee}`
					},
					"fields": [
					]
				}
			]
		};



		return this.http.post(multiplayerLobby.webhook, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) });
	}
}
