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
	sendFinalResult(selectedLobby: MultiplayerLobby, extraMessage: string, referee: string) {
		const scoreString = (selectedLobby.teamOneScore > selectedLobby.teamTwoScore) ?
			`**Score:** __${selectedLobby.teamOneName}__ | **${selectedLobby.teamOneScore}** - ${selectedLobby.teamTwoScore} | ${selectedLobby.teamTwoName}` :
			`**Score:** ${selectedLobby.teamOneName} | ${selectedLobby.teamOneScore} - **${selectedLobby.teamTwoScore}** | __${selectedLobby.teamTwoName}__`;

		const body = {
			'embeds': [
				{
					'title': `Result of **${selectedLobby.teamOneName}** vs. **${selectedLobby.teamTwoName}**`,
					'url': selectedLobby.multiplayerLink,
					'description': `${scoreString} \n\n**First pick**: ${selectedLobby.firstPick} \n\n[${selectedLobby.multiplayerLink}](${selectedLobby.multiplayerLink})`,
					'color': 15258703,
					'timestamp': new Date(),
					'footer': {
						'text': `Match referee was ${referee}`
					},
					'fields': [
					]
				}
			]
		}

		const teamOneBans: any[] = [];
		const teamTwoBans: any[] = [];

		if (selectedLobby.teamOneBans.length > 0) {
			for (const ban of selectedLobby.teamOneBans) {
				teamOneBans.push(`[${this.getBeatmapnameFromMappools(ban).name}](${this.getBeatmapnameFromMappools(ban).beatmapUrl})`);
			}

			body.embeds[0].fields.push({
				'name': `**${selectedLobby.teamOneName}** bans:`,
				'value': teamOneBans.join('\n'),
				'inline': true
			});

		}

		if (selectedLobby.teamTwoBans.length > 0) {
			for (const ban of selectedLobby.teamTwoBans) {
				teamTwoBans.push(`[${this.getBeatmapnameFromMappools(ban).name}](${this.getBeatmapnameFromMappools(ban).beatmapUrl})`);
			}

			body.embeds[0].fields.push({
				'name': `**${selectedLobby.teamTwoName}** bans:`,
				'value': teamTwoBans.join('\n'),
				'inline': true
			});
		}

		if (extraMessage != null) {
			body.embeds[0].fields.push({
				'name': `**Additional message by ${referee}**`,
				'value': extraMessage,
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
	sendWinByDefaultResult(selectedLobby: MultiplayerLobby, extraMessage: string, wbdWinningTeam: string, wbdLosingTeam: string, referee: string) {
		let resultDescription = `**Score:** __${wbdWinningTeam}__ | 1 - 0 | ${wbdLosingTeam} \n\n__${wbdLosingTeam}__ failed to show up.`;

		if (wbdWinningTeam == 'no-one') {
			resultDescription = `**Score:** ${selectedLobby.teamOneName} | 0 - 0 | ${selectedLobby.teamTwoName} \n\nBoth __${selectedLobby.teamOneName}__ and __${selectedLobby.teamTwoName}__ failed to show up.`;
		}

		const body = {
			'embeds': [
				{
					'title': `Result of **${selectedLobby.teamOneName}** vs. **${selectedLobby.teamTwoName}**`,
					'description': resultDescription,
					'color': 15258703,
					'timestamp': new Date(),
					'footer': {
						'text': `Match referee was ${referee}`
					},
					'fields': [
					]
				}
			]
		};

		if (extraMessage != null) {
			body.embeds[0].fields.push({
				'name': `**Additional message by ${referee}**`,
				'value': extraMessage,
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
	sendBanResult(selectedLobby: MultiplayerLobby, teamName: string, ban: ModBracketMap, referee: string) {
		const cachedBeatmap = this.cacheService.getCachedBeatmapFromMappools(ban.beatmapId);

		const body = {
			'embeds': [
				{
					'title': `🔨 Ban update - ${selectedLobby.teamOneName} vs ${selectedLobby.teamTwoName}`,
					'url': selectedLobby.multiplayerLink,
					'description': `**${teamName}** has banned [**${ban.beatmapName}**](${ban.beatmapUrl})`,
					'color': 15258703,
					'timestamp': new Date(),
					'footer': {
						'text': `Match referee was ${referee}`
					},
					'thumbnail': {
						'url': `https://b.ppy.sh/thumb/${cachedBeatmap.beatmapSetId}.jpg`
					},
					'fields': [
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
	sendMatchFinishedResult(multiplayerLobby: MultiplayerLobby, referee: string) {
		const lastMultiplayerData = multiplayerLobby.multiplayerData[multiplayerLobby.multiplayerData.length - 1];
		const cachedBeatmap = this.cacheService.getCachedBeatmapFromMappools(lastMultiplayerData.beatmap_id);

		// Map is a warmup map most likely, skip
		if (cachedBeatmap == null) {
			return null;
		}

		let resultString = '';
		let embedHeader = '';
		let lostTheirPick = false;

		// The pick was from team two
		if (multiplayerLobby.getNextPickName() == multiplayerLobby.teamOneName) {
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

		const highestScorePlayerName = this.cacheService.getCachedUser(highestScorePlayer.user).username;
		const highestAccuracyPlayerName = this.cacheService.getCachedUser(highestAccuracyPlayer.user).username;

		resultString += `**MVP score**: __${highestScorePlayerName}__ with ${highestScorePlayer.score} points and ${highestScorePlayer.accuracy}% accuracy\n`;
		resultString += `**MVP accuracy**: __${highestAccuracyPlayerName}__ with ${highestAccuracyPlayer.score} points and ${highestAccuracyPlayer.accuracy}% accuracy\n\n`;

		resultString += `Next pick is for __${multiplayerLobby.getNextPickName()}__`;

		const body = {
			'embeds': [
				{
					'title': `🏁 ${embedHeader}`,
					'url': multiplayerLobby.multiplayerLink,
					'description': resultString,
					'color': lostTheirPick ? 0xad324f : 0x32a852,
					'timestamp': new Date(),
					'thumbnail': {
						'url': `https://b.ppy.sh/thumb/${cachedBeatmap.beatmapSetId}.jpg`
					},
					'footer': {
						'text': `Match referee was ${referee}`
					},
					'fields': [
					]
				}
			]
		};

		return this.http.post(multiplayerLobby.webhook, body, { headers: new HttpHeaders({ 'Content-type': 'application/json' }) });
	}
}
