import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SendBeatmapResultDialogData } from 'app/components/irc/irc.component';
import { MultiplayerData } from 'app/models/store-multiplayer/multiplayer-data';
import { CacheService } from 'app/services/cache.service';
import { IrcService } from 'app/services/irc.service';

@Component({
	selector: 'app-send-beatmap-result',
	templateUrl: './send-beatmap-result.component.html',
	styleUrls: ['./send-beatmap-result.component.scss']
})
export class SendBeatmapResultComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: SendBeatmapResultDialogData, private cacheService: CacheService, private ircService: IrcService, private dialogRef: MatDialogRef<SendBeatmapResultComponent>) { }
	ngOnInit(): void { }

	/**
	 * Get the cover image
	 *
	 * @param beatmapId the beatmapid
	 */
	getBeatmapCoverUrl(beatmapId: number): string {
		const cachedBeatmap = this.cacheService.getCachedBeatmap(beatmapId);
		return (cachedBeatmap != null) ? `https://assets.ppy.sh/beatmaps/${cachedBeatmap.beatmapSetId}/covers/cover.jpg` : '';
	}

	/**
	 * Get the cached beatmap if it exists
	 *
	 * @param beatmapId the beatmapid
	 */
	getBeatmapname(beatmapId: number) {
		const cachedBeatmap = this.cacheService.getCachedBeatmap(beatmapId);
		return (cachedBeatmap != null) ? cachedBeatmap.name : 'Unknown beatmap, synchronize the lobby to get the map name.';
	}

	/**
	 * Send the result of the beatmap to irc if connected
	 * NOTE: Update in lobby-view.component.ts as well
	 *
	 * @param match
	 */
	sendBeatmapResult(match: MultiplayerData) {
		// User is connected to irc channel
		if (this.ircService.getChannelByName(this.data.ircChannel) != null) {
			const totalMapsPlayed = this.data.multiplayerLobby.teamOneScore + this.data.multiplayerLobby.teamTwoScore;
			let nextPick = '';

			// First pick goes to .firstPick
			if (totalMapsPlayed % 2 == 0) {
				nextPick = this.data.multiplayerLobby.firstPick;
			}
			else {
				nextPick = this.data.multiplayerLobby.firstPick == this.data.multiplayerLobby.teamOneName ? this.data.multiplayerLobby.teamTwoName : this.data.multiplayerLobby.teamOneName;
			}

			if (match.team_one_score > match.team_two_score) {
				const teamOneHasWon = (this.data.multiplayerLobby.teamOneScore == Math.ceil(this.data.multiplayerLobby.bestOf / 2));
				this.ircService.sendMessage(this.data.ircChannel, `"${this.data.multiplayerLobby.teamOneName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.getBeatmapname(match.beatmap_id)}] | Score: ${this.addDot(match.team_one_score, ' ')} - ${this.addDot(match.team_two_score, ' ')} // Score difference : ${this.addDot(match.team_one_score - match.team_two_score, ' ')}${(totalMapsPlayed != 0) ? ` | ${this.data.multiplayerLobby.teamOneName} | ${this.data.multiplayerLobby.teamOneScore} : ${this.data.multiplayerLobby.teamTwoScore} | ${this.data.multiplayerLobby.teamTwoName} ${!teamOneHasWon ? '// Next pick is for ' + nextPick : ''}` : ''}`);
			}
			else {
				const teamTwoHasWon = (this.data.multiplayerLobby.teamTwoScore == Math.ceil(this.data.multiplayerLobby.bestOf / 2));
				this.ircService.sendMessage(this.data.ircChannel, `"${this.data.multiplayerLobby.teamTwoName}" has won on [https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.getBeatmapname(match.beatmap_id)}] | Score: ${this.addDot(match.team_one_score, ' ')} - ${this.addDot(match.team_two_score, ' ')} // Score difference : ${this.addDot(match.team_two_score - match.team_one_score, ' ')}${(totalMapsPlayed != 0) ? ` | ${this.data.multiplayerLobby.teamOneName} | ${this.data.multiplayerLobby.teamOneScore} : ${this.data.multiplayerLobby.teamTwoScore} | ${this.data.multiplayerLobby.teamTwoName} ${!teamTwoHasWon ? '// Next pick is for ' + nextPick : ''}` : ''}`);
			}

			this.dialogRef.close(true);
		}
	}

	/**
	 * Split the string
	 *
	 * @param nStr the string to split
	 * @param splitter the character to split the string with
	 */
	addDot(nStr: string | number, splitter: string) {
		nStr = nStr.toString();
		const x = nStr.split('.');
		let x1: string = x[0];
		const x2 = x.length > 1 ? `.${x[1]}` : '';
		const rgx = /(\d+)(\d{3})/;

		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, `$1${splitter}$2`);
		}

		return x1 + x2;
	}
}
