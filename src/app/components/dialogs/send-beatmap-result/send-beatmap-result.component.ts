import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISendBeatmapResultDialogData } from 'app/interfaces/i-send-beatmap-result-dialog-data';
import { MultiplayerData } from 'app/models/store-multiplayer/multiplayer-data';
import { WyTriggerMessage } from 'app/models/wytournament/trigger-message';
import { CacheService } from 'app/services/cache.service';
import { IrcService } from 'app/services/irc.service';

@Component({
	selector: 'app-send-beatmap-result',
	templateUrl: './send-beatmap-result.component.html',
	styleUrls: ['./send-beatmap-result.component.scss']
})
export class SendBeatmapResultComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: ISendBeatmapResultDialogData, public cacheService: CacheService, private ircService: IrcService, private dialogRef: MatDialogRef<SendBeatmapResultComponent>) { }
	ngOnInit(): void { }

	/**
	 * Send the result of the beatmap to irc if connected
	 * NOTE: Update in lobby-view.component.ts and irc-component.ts as well
	 *
	 * @param match
	 */
	sendBeatmapResult(match: MultiplayerData) {
		// User is connected to irc channel
		if (this.ircService.getChannelByName(this.data.ircChannel) != null) {
			for (const triggerMessage of this.data.multiplayerLobby.tournament.triggerMessages) {
				const finalMessage = WyTriggerMessage.translateMessage(triggerMessage.message, match, this.data.multiplayerLobby, this.cacheService.getBeatmapname(match.beatmap_id));

				if (triggerMessage.beatmapResult) {
					if (triggerMessage.nextPickMessage) {
						if (this.data.multiplayerLobby.teamHasWon() == null && !this.data.multiplayerLobby.getTiebreaker()) {
							this.ircService.sendMessage(this.data.ircChannel, finalMessage);
						}
					}
					else if (triggerMessage.nextPickTiebreakerMessage) {
						if (this.data.multiplayerLobby.teamHasWon() == null && this.data.multiplayerLobby.getTiebreaker()) {
							this.ircService.sendMessage(this.data.ircChannel, finalMessage);
						}
					}
					else if (triggerMessage.matchWonMessage) {
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
