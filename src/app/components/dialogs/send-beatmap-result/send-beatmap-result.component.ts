import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISendBeatmapResultDialogData } from 'app/interfaces/i-send-beatmap-result-dialog-data';
import { CTMCalculation } from 'app/models/score-calculation/calculation-types/ctm-calculation';
import { MultiplayerData } from 'app/models/store-multiplayer/multiplayer-data';
import { CacheService } from 'app/services/cache.service';
import { IrcService } from 'app/services/irc.service';

@Component({
	selector: 'app-send-beatmap-result',
	templateUrl: './send-beatmap-result.component.html',
	styleUrls: ['./send-beatmap-result.component.scss']
})
export class SendBeatmapResultComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: ISendBeatmapResultDialogData, private cacheService: CacheService, private ircService: IrcService, private dialogRef: MatDialogRef<SendBeatmapResultComponent>) { }
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
			const replaceWords = {
				'{{\\s{0,}beatmapWinner\\s{0,}}}': match.team_one_score > match.team_two_score ? this.data.multiplayerLobby.teamOneName : this.data.multiplayerLobby.teamTwoName,
				'{{\\s{0,}beatmap\\s{0,}}}': `[https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${this.getBeatmapname(match.beatmap_id)}]`,
				'{{\\s{0,}beatmapTeamOneScore\\s{0,}}}': this.addDot(match.team_one_score, ' '),
				'{{\\s{0,}beatmapTeamTwoScore\\s{0,}}}': this.addDot(match.team_two_score, ' '),
				'{{\\s{0,}scoreDifference\\s{0,}}}': match.team_one_score > match.team_two_score ? this.addDot(match.team_one_score - match.team_two_score, ' ') : this.addDot(match.team_two_score - match.team_one_score, ' '),
				'{{\\s{0,}teamOneName\\s{0,}}}': this.data.multiplayerLobby.teamOneName,
				'{{\\s{0,}teamTwoName\\s{0,}}}': this.data.multiplayerLobby.teamTwoName,
				'{{\\s{0,}matchTeamOneScore\\s{0,}}}': this.data.multiplayerLobby.getTeamOneScore(),
				'{{\\s{0,}matchTeamTwoScore\\s{0,}}}': this.data.multiplayerLobby.getTeamTwoScore(),
				'{{\\s{0,}nextPick\\s{0,}}}': this.data.multiplayerLobby.getNextPick(),
				'{{\\s{0,}matchWinner\\s{0,}}}': this.data.multiplayerLobby.teamHasWon()
			};

			if (this.data.multiplayerLobby.tournament.scoreInterface instanceof CTMCalculation) {
				replaceWords['{{\\s{0,}teamOneHitpoints\\s{0,}}}'] = this.data.multiplayerLobby.teamOneHealth;
				replaceWords['{{\\s{0,}teamTwoHitpoints\\s{0,}}}'] = this.data.multiplayerLobby.teamTwoHealth;

				for (const modBracket of this.data.multiplayerLobby.mappool.modBrackets) {
					for (const beatmap of modBracket.beatmaps) {
						if (beatmap.beatmapId == match.beatmap_id) {
							replaceWords['{{\\s{0,}damageDealt\\s{0,}}}'] = beatmap.damageAmount;
							break;
						}
					}
				}
			}

			for (const beatmapResultMessage of this.data.multiplayerLobby.tournament.beatmapResultMessages) {
				let finalMessage = beatmapResultMessage.message;

				for (const regex in replaceWords) {
					finalMessage = finalMessage.replace(new RegExp(regex), replaceWords[regex]);
				}

				if (beatmapResultMessage.beatmapResult) {
					if (beatmapResultMessage.nextPickMessage) {
						if (this.data.multiplayerLobby.teamHasWon() == null && !this.data.multiplayerLobby.getTiebreaker()) {
							this.ircService.sendMessage(this.data.ircChannel, finalMessage);
						}
					}
					else if (beatmapResultMessage.nextPickTiebreakerMessage) {
						if (this.data.multiplayerLobby.teamHasWon() == null && this.data.multiplayerLobby.getTiebreaker()) {
							this.ircService.sendMessage(this.data.ircChannel, finalMessage);
						}
					}
					else if (beatmapResultMessage.matchWonMessage) {
						if (this.data.multiplayerLobby.teamHasWon() != null) {
							this.ircService.sendMessage(this.data.ircChannel, finalMessage);
						}
					}
					else {
						this.ircService.sendMessage(this.data.ircChannel, finalMessage);
					}
				}
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
