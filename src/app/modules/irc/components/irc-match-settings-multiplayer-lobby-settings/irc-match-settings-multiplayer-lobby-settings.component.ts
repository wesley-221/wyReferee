import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { IrcService } from '../../../../services/irc.service';

@Component({
	selector: 'app-irc-match-settings-multiplayer-lobby-settings',
	templateUrl: './irc-match-settings-multiplayer-lobby-settings.component.html',
	styleUrl: './irc-match-settings-multiplayer-lobby-settings.component.scss'
})
export class IrcMatchSettingsMultiplayerLobbySettingsComponent {
	@ViewChild('teamMode') teamMode: ElementRef;
	@ViewChild('winCondition') winCondition: ElementRef;
	@ViewChild('players') players: ElementRef;

	@Input() selectedChannel: IrcChannel;

	roomSettingGoingOn: boolean;
	roomSettingDelay: number;

	constructor(
		private ircService: IrcService
	) {
		this.roomSettingGoingOn = false;
		this.roomSettingDelay = 0;
	}

	onRoomSettingChange() {
		if (!this.roomSettingGoingOn) {
			const timer =
				setInterval(() => {
					if (this.roomSettingDelay == 1) {
						this.ircService.sendMessage(this.selectedChannel.name, `!mp set ${this.teamMode.nativeElement.value as string} ${this.winCondition.nativeElement.value as string} ${this.players.nativeElement.value == undefined ? 8 : this.players.nativeElement.value as string}`);

						this.ircService.getChannelByName(this.selectedChannel.name).teamMode = this.teamMode.nativeElement.value;
						this.ircService.getChannelByName(this.selectedChannel.name).winCondition = this.winCondition.nativeElement.value;
						this.ircService.getChannelByName(this.selectedChannel.name).players = this.players.nativeElement.value;

						this.roomSettingGoingOn = false;
						this.roomSettingDelay = 0;

						clearInterval(timer);
					}

					this.roomSettingDelay--;
				}, 1000);

			this.roomSettingGoingOn = true;
		}

		this.roomSettingDelay = 3;
	}
}
