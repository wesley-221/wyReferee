import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IrcService } from '../../../../services/irc.service';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { ToastService } from '../../../../services/toast.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
	selector: 'app-irc-lobbies',
	templateUrl: './irc-lobbies.component.html',
	styleUrl: './irc-lobbies.component.scss'
})
export class IrcLobbiesComponent {
	@Input() selectedChannel: IrcChannel;
	@Input() channels: IrcChannel[];
	@Output() changeChannel = new EventEmitter<string>();

	constructor(
		public ircService: IrcService,
		private toastService: ToastService
	) { }

	changeChannelClick(channelName: string) {
		this.changeChannel.emit(channelName);
	}

	/**
	 * Edit the label of a channel
	 *
	 * @param channel the channel to edit the label for
	 */
	editLabel(channel: IrcChannel): void {
		channel.editingLabel = !channel.editingLabel;

		// Stopped editing the label
		if (channel.editingLabel == false) {
			window.electronApi.irc.setIrcChannelLabel(channel.name, channel.label);
		}
		else {
			// Store old label when starting to edit so we can revert if canceled
			channel.oldLabel = channel.label;
		}
	}

	/**
	 * Cancel editing the label of a channel
	 *
	 * @param channel the channel to cancel editing the label for
	 */
	cancelEditLabel(channel: IrcChannel): void {
		channel.editingLabel = !channel.editingLabel;

		// When creating label for the first time channel.oldLabel will get set to undefined since channel.label will be undefined
		if (channel.oldLabel !== undefined && channel.oldLabel !== null) {
			channel.label = channel.oldLabel;

			window.electronApi.irc.setIrcChannelLabel(channel.name, channel.label);
		}
	}

	/**
	 * Play a sound when a message is being send to a specific channel
	 *
	 * @param channel the channel that should where a message should be send from
	 * @param status mute or unmute the sound
	 */
	playSound(channel: IrcChannel, status: boolean) {
		channel.playSoundOnMessage = status;
		window.electronApi.irc.setIrcPlaySoundOnMessage(channel.name, status);

		this.toastService.addToast(`${channel.name} will ${status == false ? 'no longer beep on message' : 'now beep on message'}.`);
	}

	/**
	 * Part from a channel
	 *
	 * @param channelName the channel to part
	 */
	partChannel(channelName: string) {
		this.ircService.partChannel(channelName);
	}

	/**
	 * Drop a channel to rearrange it
	 *
	 * @param event
	 */
	dropChannel(event: CdkDragDrop<IrcChannel[]>) {
		moveItemInArray(this.channels, event.previousIndex, event.currentIndex);

		const changedChannels = this.channels
			.map((channel, index) => {
				if (channel.order !== index) {
					channel.order = index;

					return {
						...channel,
						order: index,
						messages: [],
						banchoBotMessages: [],
						plainMessageHistory: []
					};
				}

				return null;
			})
			.filter(channel => channel != null);

		window.electronApi.irc.updateChannelsOrder(changedChannels);
	}
}
