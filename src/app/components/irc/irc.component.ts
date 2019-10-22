import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IrcService } from '../../services/irc.service';
import { Channel } from '../../models/irc/channel';
import { Message } from '../../models/irc/message';
import { ElectronService } from '../../services/electron.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
declare var $: any;

@Component({
	selector: 'app-irc',
	templateUrl: './irc.component.html',
	styleUrls: ['./irc.component.scss']
})
export class IrcComponent implements OnInit {
	@ViewChild('messageContainer', { static: false}) messageContainer: ElementRef;
	@ViewChild('channelName', { static: false}) channelName: ElementRef;
	@ViewChild('chatMessage', { static: false }) chatMessage: ElementRef;

	selectedChannel: Channel;
	chats: Message[] = [];
	channels: Channel[];

	chatLength: number = 0;

	isAttemptingToJoin: boolean = false;

	constructor(public electronService: ElectronService, public ircService: IrcService) { 
		this.channels = ircService.allChannels;

		// Temporary workaround for scrolling to bottom
		setInterval(() => {
			if(this.chats.length != this.chatLength) {
				this.chatLength = this.chats.length;
	
				$('.messages').scrollTop($('.messages')[0].scrollHeight);
			}
		}, 1000);
	}

	ngOnInit() { 
		this.ircService.getIsJoiningChannel().subscribe(value => {
			this.isAttemptingToJoin = value;
		});
	}

	/**
	 * Change the channel
	 * @param channel the channel to change to
	 */
	changeChannel(channel: string) {
		this.selectedChannel = this.ircService.getChannelByName(channel);
		this.chats = this.selectedChannel.allMessages;
	}

	/**
	 * Open the modal to join a channel
	 */
	openModal() {
		$('#join-channel').modal('toggle');
	}

	/**
	 * Attempt to join a channel
	 */
	joinChannel() {
		this.ircService.joinChannel(this.channelName.nativeElement.value);
	}

	/**
	 * Part from a channel
	 * @param channelName the channel to part
	 */
	partChannel(channelName: string) {
		this.ircService.partChannel(channelName);
	}

	/**
	 * Send the entered message to the selected channel
	 */
	sendMessage() {
		this.ircService.sendMessage(this.selectedChannel.channelName, this.chatMessage.nativeElement.value);
		this.chatMessage.nativeElement.value = '';
	}

	/**
	 * Drop a channel to rearrange it
	 * @param event 
	 */
	dropChannel(event: CdkDragDrop<Channel[]>) {
		moveItemInArray(this.channels, event.previousIndex, event.currentIndex);

		this.ircService.rearrangeChannels(this.channels);
	}
}
