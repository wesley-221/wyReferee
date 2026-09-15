import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IrcService } from '../../../../services/irc.service';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { ToastService } from '../../../../services/toast.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SettingsStoreService } from '../../../../services/storage/settings-store.service';
import { MatDialog } from '@angular/material/dialog';
import { ArchiveIrcChannelDialogComponent } from '../../../../components/dialogs/archive-irc-channel-dialog/archive-irc-channel-dialog.component';

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
		private toastService: ToastService,
		private settingsStore: SettingsStoreService,
		private dialog: MatDialog
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
		const archiveAfterPartingIrc = this.settingsStore.get('archiveAfterPartingIrc');
		const remindAboutArchivingIrc = this.settingsStore.get('remindAboutArchivingIrc');

		if (remindAboutArchivingIrc == true) {
			const ircChannel = this.ircService.getChannelByName(channelName);

			const dialogRef = this.dialog.open(ArchiveIrcChannelDialogComponent, {
				data: ircChannel
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result != null) {
					if (result.result == null) {
						return;
					}

					// User chose not to archive the channel
					if (result.result == false) {
						// TODO: uncomment this
						// this.ircService.partChannel(channelName);

						if (result.rememberChoice == true) {
							this.settingsStore.set('archiveAfterPartingIrc', false);
							this.settingsStore.set('remindAboutArchivingIrc', false);
						}
					}
					// User chose to archive the channel
					else {
						// TODO: uncomment this, implement the `true` in partChannel (archive channel)
						// this.ircService.partChannel(channelName, true);

						if (result.rememberChoice == true) {
							this.settingsStore.set('archiveAfterPartingIrc', true);
							this.settingsStore.set('remindAboutArchivingIrc', false);
						}
					}
				}
			});
		}
		else {
			if (archiveAfterPartingIrc == false) {
				// TODO: uncomment this
				// this.ircService.partChannel(channelName);
			}
			else {
				// TODO: uncomment this, implement the `true` in partChannel (archive channel)
				// this.ircService.partChannel(channelName, true);
			}
		}
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
