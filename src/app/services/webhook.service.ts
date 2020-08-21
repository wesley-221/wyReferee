import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MultiplayerLobby } from '../models/store-multiplayer/multiplayer-lobby';
import { IrcService } from './irc.service';
import { CacheService } from './cache.service';
import { ModBracketMap } from '../models/osu-mappool/mod-bracket-map';
import { CacheBeatmap } from '../models/cache/cache-beatmap';

@Injectable({
	providedIn: 'root'
})
export class WebhookService {

	constructor(private http: HttpClient, private ircService: IrcService, private cacheService: CacheService) { }

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
	 */
	sendFinalResult(selectedLobby: MultiplayerLobby, extraMessage: String) {
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
						"text": `Match referee was ${this.ircService.authenticatedUser}`
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
				"name": `**Additional message by ${this.ircService.authenticatedUser}**`,
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
	 */
	sendWinByDefaultResult(selectedLobby: MultiplayerLobby, extraMessage: String, wbdWinningTeam: String, wbdLosingTeam: String) {
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
						"text": `Match referee was ${this.ircService.authenticatedUser}`
					},
					"fields": [
					]
				}
			]
		};

		if (extraMessage != null) {
			body.embeds[0].fields.push({
				"name": `**Additional message by ${this.ircService.authenticatedUser}**`,
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
	 */
	sendBanResult(selectedLobby: MultiplayerLobby, teamName: String, ban: ModBracketMap) {
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
						"text": `Match referee was ${this.ircService.authenticatedUser}`
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
	 */
	sendPickResult(selectedLobby: MultiplayerLobby, beatmap: ModBracketMap) {
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
						"text": `Match referee was ${this.ircService.authenticatedUser}`
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
}
