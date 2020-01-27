import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IrcService } from '../../services/irc.service';
import { Channel } from '../../models/irc/channel';
import { Message } from '../../models/irc/message';
import { ElectronService } from '../../services/electron.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { MappoolService } from '../../services/mappool.service';
import { ModBracketMap } from '../../models/osu-mappool/mod-bracket-map';
import { ModBracket } from '../../models/osu-mappool/mod-bracket';
import { MultiplayerLobbiesService } from '../../services/multiplayer-lobbies.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { StoreService } from '../../services/store.service';
declare var $: any;

@Component({
	selector: 'app-irc',
	templateUrl: './irc.component.html',
	styleUrls: ['./irc.component.scss']
})
export class IrcComponent implements OnInit {
	@ViewChild('channelName', { static: false }) channelName: ElementRef;
	@ViewChild('chatMessage', { static: false }) chatMessage: ElementRef;

	@ViewChild(VirtualScrollerComponent, { static: true }) private virtualScroller: VirtualScrollerComponent;

	selectedChannel: Channel;
	channels: Channel[];

	chats: Message[] = [];
	viewPortItems: Message[];

	chatLength: number = 0;
	keyPressed: boolean = false;

	isAttemptingToJoin: boolean = false;

	isOptionMenuMinimized: boolean = true;

	@ViewChild('teamMode', { static: false }) teamMode: ElementRef;
	@ViewChild('winCondition', { static: false }) winCondition: ElementRef;
	@ViewChild('players', { static: false }) players: ElementRef;

	searchValue: string;

	roomSettingGoingOn: boolean = false;
	roomSettingDelay: number = 2;

	constructor(public electronService: ElectronService, public ircService: IrcService, private changeDetector: ChangeDetectorRef, private storeService: StoreService,
				public mappoolService: MappoolService, private multiplayerLobbies: MultiplayerLobbiesService, private router: Router, private toastService: ToastService) { 
		this.channels = ircService.allChannels;

		this.ircService.getIsAuthenticated().subscribe(isAuthenticated => {
			// Check if the user was authenticated
			if(isAuthenticated) {
				for(let channel in this.channels) {
					// Change the channel if it was the last active channel
					if(this.channels[channel].lastActiveChannel) {
						this.changeChannel(this.channels[channel].channelName, true);

						break;
					}
				}
			}
		});

		// Initialize the scroll
		this.ircService.hasMessageBeenSend().subscribe(() => {
			if(!this.viewPortItems) {
				return;
			}

			if(this.viewPortItems[this.viewPortItems.length - 1] === this.chats[this.chats.length - 2]) {
				this.virtualScroller.scrollToIndex(this.chats.length - 1, true, 0, 0);
			}

			if(this.selectedChannel && ircService.getChannelByName(this.selectedChannel.channelName).hasUnreadMessages) {
				ircService.getChannelByName(this.selectedChannel.channelName).hasUnreadMessages = false;
			}
		});
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
	changeChannel(channel: string, delayScroll: boolean = false) {
		if(this.selectedChannel != undefined) {
			this.selectedChannel.lastActiveChannel = false;
			this.ircService.changeLastActiveChannel(this.selectedChannel, false);
		}
		
		this.selectedChannel = this.ircService.getChannelByName(channel);

		this.selectedChannel.lastActiveChannel = true;
		this.ircService.changeLastActiveChannel(this.selectedChannel, true);

		this.selectedChannel.hasUnreadMessages = false;
		
		this.chats = this.selectedChannel.allMessages;

		// Scroll to the bottom - delay it by 500 ms or do it instantly
		if(delayScroll) {
			setTimeout(() => {
				this.virtualScroller.scrollToIndex(this.chats.length - 1, true, 0, 0);
			}, 500);
		}
		else {
			this.virtualScroller.scrollToIndex(this.chats.length - 1, true, 0, 0);
		}

		// Reset search bar
		this.searchValue = "";

		// Channel was changed to a multiplayer lobby
		if(channel.startsWith('#mp_') && this.selectedChannel.active) {
			// Check if either the team mode or win condition isn't set
			if(this.selectedChannel.teamMode == undefined || this.selectedChannel.winCondition == undefined) {
				this.ircService.sendMessage(channel, '!mp settings');
			}
		}
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

		if(this.selectedChannel != undefined && (this.selectedChannel.channelName == channelName)) {
			this.selectedChannel = undefined;
			this.chats = [];
		}
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

	/**
	 * When a key was pressed
	 * @param event 
	 * @param eventName up or down (for key up/down)
	 */
	onKey(event: KeyboardEvent, eventName: string) {
		event.preventDefault();

		// Check if the pressed key was tab
		if(event.key === "Tab") {
			this.changeDetector.detectChanges();
			this.chatMessage.nativeElement.focus();

			// The key is being hold
			if(eventName == "down") {
				if(this.keyPressed == false) {
					// Check if there is a selected channel
					if(this.selectedChannel != undefined) {
						// Check if the object exists
						if(!this.ircService.client.chans.hasOwnProperty(this.selectedChannel.channelName)) return;

						const lastWordOfSentence = this.chatMessage.nativeElement.value.split(" ").pop();
						let matchedUsers = [];

						// Prevent 0 letter autocompletion
						if(lastWordOfSentence.length < 1) return;

						for(let user in this.ircService.client.chans[this.selectedChannel.channelName].users) {
							// Remove irc levels
							const newUser = user.replace(/[\@|\+]/gi, '');

							if(newUser.toLowerCase().startsWith(lastWordOfSentence.toLowerCase())) {
								matchedUsers.push(newUser);
							}
						}

						// Show the matched users
						if(matchedUsers.length > 1) {
							this.ircService.addMessageToChannel(this.selectedChannel.channelName, 'BanchoBot', `Matched users: ${matchedUsers.join(', ')}`);
						}
						// Replace the autocompleted user
						else if(matchedUsers.length == 1) {
							this.chatMessage.nativeElement.value = this.chatMessage.nativeElement.value.replace(lastWordOfSentence, matchedUsers[0]);
						}
					}

					this.keyPressed = true;
				}
			}
			// The key was released
			else {
				this.keyPressed = false;
			}
		}
	}

	/**
	 * Open the link to the users userpage
	 * @param username
	 */
	openUserpage(username: string) {
		this.electronService.openLink(`https://osu.ppy.sh/users/${username}`);
	}

	/**
	 * Change the current mappool
	 * @param event 
	 */
	onMappoolChange(event: Event) {
		this.ircService.getChannelByName(this.selectedChannel.channelName).mappool = this.mappoolService.getMappool((<any>event.currentTarget).value);
	}

	/**
	 * Pick a beatmap from the given bracket
	 * @param beatmap the picked beatmap
	 * @param bracket the bracket where the beatmap is from
	 */
	pickBeatmap(beatmap: ModBracketMap, bracket: ModBracket) {
		this.ircService.sendMessage(this.selectedChannel.channelName, `!mp map ${beatmap.beatmapId} ${beatmap.gamemodeId}`);

		// Reset all mods if the freemod is being enabled
		if(bracket.mods.includes('freemod')) {
			this.ircService.sendMessage(this.selectedChannel.channelName, '!mp mods none');
		}

		this.ircService.sendMessage(this.selectedChannel.channelName, `${bracket.mods}`);
	}

	/**
	 * Change the room settings
	 */
	onRoomSettingChange() {
		if(!this.roomSettingGoingOn) {
			let timer = 
			setInterval(() => {
				if(this.roomSettingDelay == 0) {
					this.ircService.sendMessage(this.selectedChannel.channelName, `!mp set ${this.teamMode.nativeElement.value} ${this.winCondition.nativeElement.value} ${this.players.nativeElement.value}`);

					this.ircService.getChannelByName(this.selectedChannel.channelName).teamMode = this.teamMode.nativeElement.value;
					this.ircService.getChannelByName(this.selectedChannel.channelName).winCondition = this.winCondition.nativeElement.value;
					this.ircService.getChannelByName(this.selectedChannel.channelName).players = this.players.nativeElement.value;

					this.roomSettingGoingOn = false;
					clearInterval(timer);
				}

				this.roomSettingDelay --;
			}, 1000);

			this.roomSettingGoingOn = true;
		}
		
		this.roomSettingDelay = 3;	
	}

	navigateLobbyOverview() {
		const lobbyId = this.multiplayerLobbies.getByIrcLobby(this.selectedChannel.channelName).lobbyId;

		if(lobbyId) {
			this.router.navigate(['lobby-view', lobbyId]);
		}
		else {
			this.toastService.addToast(`No lobby overview found for this irc channel`);
		}
	}

	playSound(channel: Channel, status: boolean) {
		channel.playSoundOnMessage = status;
		this.storeService.set(`irc.channels.${channel.channelName}.playSoundOnMessage`, status);
		this.toastService.addToast(`${channel.channelName} will ${status == false ? "no longer beep on message" : "now beep on message"}.`);
	}
}
