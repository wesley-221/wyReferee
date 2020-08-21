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
import { MultiplayerLobby } from '../../models/store-multiplayer/multiplayer-lobby';
import { Mappool } from '../../models/osu-mappool/mappool';
import { ToastType } from '../../models/toast';
import { WebhookService } from '../../services/webhook.service';
declare var $: any;

@Component({
	selector: 'app-irc',
	templateUrl: './irc.component.html',
	styleUrls: ['./irc.component.scss']
})
export class IrcComponent implements OnInit {
	@ViewChild('channelName') channelName: ElementRef;
	@ViewChild('chatMessage') chatMessage: ElementRef;

	@ViewChild(VirtualScrollerComponent, { static: true }) private virtualScroller: VirtualScrollerComponent;

	selectedChannel: Channel;
	selectedLobby: MultiplayerLobby;
	channels: Channel[];

	chats: Message[] = [];
	viewPortItems: Message[];

	chatLength: number = 0;
	keyPressed: boolean = false;

	isAttemptingToJoin: boolean = false;

	isOptionMenuMinimized: boolean = true;

	@ViewChild('teamMode') teamMode: ElementRef;
	@ViewChild('winCondition') winCondition: ElementRef;
	@ViewChild('players') players: ElementRef;

	searchValue: string;

	roomSettingGoingOn: boolean = false;
	roomSettingDelay: number = 2;

	teamOneScore: number = 0;
	teamTwoScore: number = 0;
	nextPick: string = null;
	breakpoint: string = null;
	hasWon: string = null;

	popupBannedMap: ModBracketMap = null;
	popupBannedBracket: ModBracket = null;

	constructor(
		public electronService: ElectronService,
		public ircService: IrcService,
		private changeDetector: ChangeDetectorRef,
		private storeService: StoreService,
		public mappoolService: MappoolService,
		private multiplayerLobbies: MultiplayerLobbiesService,
		private router: Router,
		private toastService: ToastService,
		private webhookService: WebhookService) {
		this.channels = ircService.allChannels;

		this.ircService.getIsAuthenticated().subscribe(isAuthenticated => {
			// Check if the user was authenticated
			if (isAuthenticated) {
				for (let channel in this.channels) {
					// Change the channel if it was the last active channel
					if (this.channels[channel].lastActiveChannel) {
						this.changeChannel(this.channels[channel].channelName, true);
						break;
					}
				}
			}
		});

		// Initialize the scroll
		this.ircService.hasMessageBeenSend().subscribe(() => {
			if (!this.viewPortItems) {
				return;
			}

			if (this.viewPortItems[this.viewPortItems.length - 1] === this.chats[this.chats.length - 2]) {
				this.virtualScroller.scrollToIndex(this.chats.length - 1, true, 0, 0);
			}

			if (this.selectedChannel && ircService.getChannelByName(this.selectedChannel.channelName).hasUnreadMessages) {
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
		if (this.selectedChannel != undefined) {
			this.selectedChannel.lastActiveChannel = false;
			this.ircService.changeLastActiveChannel(this.selectedChannel, false);
		}

		this.selectedChannel = this.ircService.getChannelByName(channel);
		this.selectedLobby = this.multiplayerLobbies.getByIrcLobby(channel);

		this.selectedChannel.lastActiveChannel = true;
		this.ircService.changeLastActiveChannel(this.selectedChannel, true);

		this.selectedChannel.hasUnreadMessages = false;
		this.chats = this.selectedChannel.allMessages;

		this.multiplayerLobbies.synchronizeIsCompleted().subscribe(data => {
			if (data != -1) {
				this.refreshIrcHeader(this.multiplayerLobbies.get(data));
			}
		});

		if (this.selectedLobby != undefined) {
			this.teamOneScore = this.selectedLobby.teamOneScore;
			this.teamTwoScore = this.selectedLobby.teamTwoScore;
			this.nextPick = this.selectedLobby.getNextPickName();
			this.breakpoint = this.selectedLobby.getBreakpoint();
			this.hasWon = this.selectedLobby.getHasWon();
		}

		// Scroll to the bottom - delay it by 500 ms or do it instantly
		if (delayScroll) {
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
		if (channel.startsWith('#mp_') && this.selectedChannel.active) {
			// Check if either the team mode or win condition isn't set
			if (this.selectedChannel.teamMode == undefined || this.selectedChannel.winCondition == undefined && this.selectedChannel.active) {
				this.ircService.sendMessage(channel, '!mp settings');
			}
		}
	}

	/**
	 * Open the modal to join a channel
	 */
	openModal(modalName: string) {
		$(`#${modalName}`).modal('toggle');
	}

	/**
	 * Hide the modal
	 */
	hideModal(modalName: string) {
		$(`#${modalName}`).modal('toggle');
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

		if (this.selectedChannel != undefined && (this.selectedChannel.channelName == channelName)) {
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
		if (event.key === "Tab") {
			this.changeDetector.detectChanges();
			this.chatMessage.nativeElement.focus();

			// The key is being hold
			if (eventName == "down") {
				if (this.keyPressed == false) {
					// Check if there is a selected channel
					if (this.selectedChannel != undefined) {
						// Check if the object exists
						if (!this.ircService.client.chans.hasOwnProperty(this.selectedChannel.channelName)) return;

						const lastWordOfSentence = this.chatMessage.nativeElement.value.split(" ").pop();
						let matchedUsers = [];

						// Prevent 0 letter autocompletion
						if (lastWordOfSentence.length < 1) return;

						for (let user in this.ircService.client.chans[this.selectedChannel.channelName].users) {
							// Remove irc levels
							const newUser = user.replace(/[\@|\+]/gi, '');

							if (newUser.toLowerCase().startsWith(lastWordOfSentence.toLowerCase())) {
								matchedUsers.push(newUser);
							}
						}

						// Show the matched users
						if (matchedUsers.length > 1) {
							this.ircService.addMessageToChannel(this.selectedChannel.channelName, 'BanchoBot', `Matched users: ${matchedUsers.join(', ')}`);
						}
						// Replace the autocompleted user
						else if (matchedUsers.length == 1) {
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
		this.selectedLobby.mappool = this.mappoolService.getMappool((<any>event.currentTarget).value);
		this.selectedLobby.mappoolId = this.mappoolService.getMappool((<any>event.currentTarget).value).id;

		this.multiplayerLobbies.update(this.selectedLobby);
	}

	/**
	 * Pick a beatmap from the given bracket
	 * @param beatmap the picked beatmap
	 * @param bracket the bracket where the beatmap is from
	 */
	pickBeatmap(beatmap: ModBracketMap, bracket: ModBracket, gamemode: number = null) {
		this.ircService.sendMessage(this.selectedChannel.channelName, `!mp map ${beatmap.beatmapId} ${(gamemode != null ? gamemode : beatmap.gamemodeId)}`);

		let modBit = 0,
			freemodEnabled = false;

		for (let mod in bracket.mods) {
			if (bracket.mods[mod].modValue != "freemod") {
				modBit += parseInt(bracket.mods[mod].modValue);
			}
			else {
				freemodEnabled = true;
			}
		}

		// Reset all mods if the freemod is being enabled
		if (freemodEnabled) {
			this.ircService.sendMessage(this.selectedChannel.channelName, '!mp mods none');
		}

		this.webhookService.sendPickResult(this.selectedLobby, beatmap).subscribe();

		this.ircService.sendMessage(this.selectedChannel.channelName, `!mp mods ${modBit}${freemodEnabled ? " freemod" : ""}`);
	}

	/**
	 * Change the room settings
	 */
	onRoomSettingChange() {
		if (!this.roomSettingGoingOn) {
			let timer =
				setInterval(() => {
					if (this.roomSettingDelay == 0) {
						this.ircService.sendMessage(this.selectedChannel.channelName, `!mp set ${this.teamMode.nativeElement.value} ${this.winCondition.nativeElement.value} ${this.players.nativeElement.value}`);

						this.ircService.getChannelByName(this.selectedChannel.channelName).teamMode = this.teamMode.nativeElement.value;
						this.ircService.getChannelByName(this.selectedChannel.channelName).winCondition = this.winCondition.nativeElement.value;
						this.ircService.getChannelByName(this.selectedChannel.channelName).players = this.players.nativeElement.value;

						this.roomSettingGoingOn = false;
						clearInterval(timer);
					}

					this.roomSettingDelay--;
				}, 1000);

			this.roomSettingGoingOn = true;
		}

		this.roomSettingDelay = 3;
	}

	/**
	 * Navigate to the lobbyoverview from irc
	 */
	navigateLobbyOverview() {
		const lobbyId = this.multiplayerLobbies.getByIrcLobby(this.selectedChannel.channelName).lobbyId;

		if (lobbyId) {
			this.router.navigate(['lobby-view', lobbyId]);
		}
		else {
			this.toastService.addToast(`No lobby overview found for this irc channel`);
		}
	}

	/**
	 * Refresh the stats for a multiplayer lobby.
	 * @param multiplayerLobby the multiplayerlobby
	 */
	refreshIrcHeader(multiplayerLobby: MultiplayerLobby) {
		this.teamOneScore = multiplayerLobby.teamOneScore;
		this.teamTwoScore = multiplayerLobby.teamTwoScore;
		this.nextPick = multiplayerLobby.getNextPickName();
		this.breakpoint = multiplayerLobby.getBreakpoint();
		this.hasWon = multiplayerLobby.getHasWon();
	}

	/**
	 * Play a sound when a message is being send to a specific channel
	 * @param channel the channel that should where a message should be send from
	 * @param status mute or unmute the sound
	 */
	playSound(channel: Channel, status: boolean) {
		channel.playSoundOnMessage = status;
		this.storeService.set(`irc.channels.${channel.channelName}.playSoundOnMessage`, status);
		this.toastService.addToast(`${channel.channelName} will ${status == false ? "no longer beep on message" : "now beep on message"}.`);
	}

	/**
	 * When trying to ban a map show a modal
	 * @param beatmap
	 * @param bracket
	 */
	banBeatmapPopup(beatmap: ModBracketMap, bracket: ModBracket) {
		this.popupBannedMap = beatmap;
		this.popupBannedBracket = bracket;

		this.hideModal('ban-a-map');
	}

	/**
	 * Ban a beatmap
	 */
	banBeatmap(team: number) {
		// Handle banning
		if (team == 1) {
			this.selectedLobby.teamOneBans.push(this.popupBannedMap.beatmapId);

			this.webhookService.sendBanResult(this.selectedLobby, this.selectedLobby.teamOneName, this.popupBannedMap).subscribe();
		}
		else if (team == 2) {
			this.selectedLobby.teamTwoBans.push(this.popupBannedMap.beatmapId);

			this.webhookService.sendBanResult(this.selectedLobby, this.selectedLobby.teamTwoName, this.popupBannedMap).subscribe();
		}

		this.multiplayerLobbies.update(this.selectedLobby);

		this.hideModal('ban-a-map');
	}

	/**
	 * Check if a beatmap is banned int he current lobby
	 * @param multiplayerLobby the multiplayerlobby to check from
	 * @param beatmapId the beatmap to check
	 */
	beatmapIsBanned(multiplayerLobby: MultiplayerLobby, beatmapId: number) {
		return multiplayerLobby.teamOneBans.indexOf(beatmapId) > -1 || multiplayerLobby.teamTwoBans.indexOf(beatmapId) > -1;
	}

	/**
	 * Unban a beatmap
	 * @param beatmap
	 * @param bracket
	 */
	unbanBeatmap(beatmap: ModBracketMap, bracket: ModBracket) {
		if (this.selectedLobby.teamOneBans.indexOf(beatmap.beatmapId) > -1) {
			this.selectedLobby.teamOneBans.splice(this.selectedLobby.teamOneBans.indexOf(beatmap.beatmapId), 1);
		}
		else if (this.selectedLobby.teamTwoBans.indexOf(beatmap.beatmapId) > -1) {
			this.selectedLobby.teamTwoBans.splice(this.selectedLobby.teamTwoBans.indexOf(beatmap.beatmapId), 1);
		}

		this.multiplayerLobbies.update(this.selectedLobby);
	}

	/**
	 * Pick a mystery map
	 * @param mappool the mappool to pick from
	 * @param modBracket the modbracket to pick from
	 */
	pickMysteryMap(mappool: Mappool, modBracket: ModBracket) {
		this.mappoolService.pickMysteryMap(mappool, modBracket, this.selectedLobby, this.ircService.authenticatedUser).subscribe((res: any) => {
			if (res.modCategory == null) {
				this.toastService.addToast(res.beatmapName, ToastType.Error, 60);
			}
			else {
				const modBracketMap = ModBracketMap.serializeJson(res);
				this.pickBeatmap(modBracketMap, modBracket, mappool.gamemodeId);

				// Pick a random map and update it to the cache
				this.selectedLobby.pickModCategoryForModBracket(modBracket, modBracketMap.modCategory);
				this.multiplayerLobbies.update(this.selectedLobby);
			}
		});
	}
}
