import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISendBeatmapResultDialogData } from 'app/interfaces/i-send-beatmap-result-dialog-data';
import { MultiplayerData } from 'app/models/store-multiplayer/multiplayer-data';
import { WyConditionalMessage } from 'app/models/wytournament/wy-conditional-message';
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
			for (const conditionalMessage of this.data.multiplayerLobby.tournament.conditionalMessages) {
				const finalMessage = WyConditionalMessage.translateMessage(conditionalMessage.message, match, this.data.multiplayerLobby, this.getBeatmapname(match.beatmap_id));

				if (conditionalMessage.beatmapResult) {
					if (conditionalMessage.nextPickMessage) {
						if (this.data.multiplayerLobby.teamHasWon() == null && !this.data.multiplayerLobby.getTiebreaker()) {
							this.ircService.sendMessage(this.data.ircChannel, finalMessage);
						}
					}
					else if (conditionalMessage.nextPickTiebreakerMessage) {
						if (this.data.multiplayerLobby.teamHasWon() == null && this.data.multiplayerLobby.getTiebreaker()) {
							this.ircService.sendMessage(this.data.ircChannel, finalMessage);
						}
					}
					else if (conditionalMessage.matchWonMessage) {
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
}
