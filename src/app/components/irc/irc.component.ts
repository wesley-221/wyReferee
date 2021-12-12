import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IrcService } from '../../services/irc.service';
import { ElectronService } from '../../services/electron.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { StoreService } from '../../services/store.service';
import { ToastType } from '../../models/toast';
import { WebhookService } from '../../services/webhook.service';
import { MatDialog } from '@angular/material/dialog';
import { JoinIrcChannelComponent } from '../dialogs/join-irc-channel/join-irc-channel.component';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { BanBeatmapComponent } from '../dialogs/ban-beatmap/ban-beatmap.component';
import { MultiplayerLobbyPlayersPlayer } from 'app/models/mutliplayer-lobby-players/multiplayer-lobby-players-player';
import { MultiplayerLobbyMovePlayerComponent } from '../dialogs/multiplayer-lobby-move-player/multiplayer-lobby-move-player.component';
import { MultiplayerLobbyPlayers } from 'app/models/mutliplayer-lobby-players/multiplayer-lobby-players';
import { SendBeatmapResultComponent } from '../dialogs/send-beatmap-result/send-beatmap-result.component';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';
import { IrcChannel } from 'app/models/irc/irc-channel';
import { Lobby } from 'app/models/lobby';
import { IrcMessage } from 'app/models/irc/irc-message';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WyModBracketMap } from 'app/models/wytournament/mappool/wy-mod-bracket-map';
import { WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { IrcShortcutDialogComponent } from '../dialogs/irc-shortcut-dialog/irc-shortcut-dialog.component';
import { IrcShortcutCommandsService } from 'app/services/irc-shortcut-commands.service';
import { IrcShortcutCommand } from 'app/models/irc-shortcut-command';
import { MultiplayerLobbySettingsComponent } from '../dialogs/multiplayer-lobby-settings/multiplayer-lobby-settings.component';
import { IrcPickMapSameModBracketComponent } from '../dialogs/irc-pick-map-same-mod-bracket/irc-pick-map-same-mod-bracket.component';
import { WyTeamPlayer } from 'app/models/wytournament/wy-team-player';
import { IrcShortcutWarningDialogComponent } from '../dialogs/irc-shortcut-warning-dialog/irc-shortcut-warning-dialog.component';

export interface BanBeatmapDialogData {
	beatmap: WyModBracketMap;
	modBracket: WyModBracket;
	multiplayerLobby: Lobby;

	banForTeam: string;
}

export interface MultiplayerLobbyMovePlayerDialogData {
	allPlayers: MultiplayerLobbyPlayers;
	movePlayer: MultiplayerLobbyPlayersPlayer;
	moveToSlot: number;
}

export interface SendBeatmapResultDialogData {
	multiplayerLobby: Lobby;
	ircChannel: string;
}

export interface BeatmapModBracketDialogData {
	beatmap: WyModBracketMap;
	modBracket: WyModBracket;
	lobby: Lobby;
}

export interface IIrcShortcutCommandDialogData {
	ircShortcutCommand: IrcShortcutCommand;
	lobby: Lobby;
}

@Component({
	selector: 'app-irc',
	templateUrl: './irc.component.html',
	styleUrls: ['./irc.component.scss']
})
export class IrcComponent implements OnInit {
	@ViewChild('channelName') channelName: ElementRef;
	@ViewChild('chatMessage') chatMessage: ElementRef;

	@ViewChild(VirtualScrollerComponent, { static: true }) private virtualScroller: VirtualScrollerComponent;

	selectedChannel: IrcChannel;
	selectedLobby: Lobby;
	channels: IrcChannel[];

	chats: IrcMessage[] = [];
	viewPortItems: IrcMessage[];

	chatLength = 0;
	keyPressed = false;

	isAttemptingToJoin = false;
	attemptingToJoinChannel: string;

	isOptionMenuMinimized = true;
	isPlayerManagementMinimized = true;
	isInvitesMinimized = true;

	@ViewChild('teamMode') teamMode: MatSelect;
	@ViewChild('winCondition') winCondition: MatSelect;
	@ViewChild('players') players: MatSelect;

	searchValue: string;

	roomSettingGoingOn = false;
	roomSettingDelay = 3;

	teamOneScore = 0;
	teamTwoScore = 0;
	nextPick: string = null;
	matchpoint: string = null;
	hasWon: string = null;

	popupBannedMap: WyModBracketMap = null;
	popupBannedBracket: WyModBracket = null;

	constructor(
		public electronService: ElectronService,
		public ircService: IrcService,
		private storeService: StoreService,
		private multiplayerLobbies: WyMultiplayerLobbiesService,
		private router: Router,
		private toastService: ToastService,
		private webhookService: WebhookService,
		private dialog: MatDialog,
		public ircShortcutCommandsService: IrcShortcutCommandsService) {
		this.channels = ircService.allChannels;

		this.ircService.getIsAuthenticated().subscribe(isAuthenticated => {
			// Check if the user was authenticated
			if (isAuthenticated) {
				for (const channel in this.channels) {
					// Change the channel if it was the last active channel
					if (this.channels[channel].lastActiveChannel) {
						this.changeChannel(this.channels[channel].name, true);
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
				this.scrollToTop();
			}

			if (this.selectedChannel && ircService.getChannelByName(this.selectedChannel.name).hasUnreadMessages) {
				ircService.getChannelByName(this.selectedChannel.name).hasUnreadMessages = false;
			}
		});

		this.multiplayerLobbies.synchronizeIsCompleted().subscribe(data => {
			if (this.selectedLobby == undefined) return;

			if (data == this.selectedLobby.lobbyId) {
				this.selectedLobby = this.multiplayerLobbies.getMultiplayerLobby(data);
				this.refreshIrcHeader(this.selectedLobby);
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
	changeChannel(channel: string, delayScroll = false) {
		if (this.selectedChannel != undefined) {
			this.selectedChannel.lastActiveChannel = false;
			this.ircService.changeLastActiveChannel(this.selectedChannel, false);
		}

		this.selectedChannel = this.ircService.getChannelByName(channel);
		this.selectedLobby = this.multiplayerLobbies.getMultiplayerLobbyByIrc(channel);

		this.selectedChannel.lastActiveChannel = true;
		this.ircService.changeLastActiveChannel(this.selectedChannel, true);

		this.selectedChannel.hasUnreadMessages = false;
		this.chats = this.selectedChannel.messages;

		this.refreshIrcHeader(this.selectedLobby);

		if (this.selectedLobby != undefined) {
			this.teamOneScore = this.selectedLobby.teamOneScore;
			this.teamTwoScore = this.selectedLobby.teamTwoScore;
			this.nextPick = this.selectedLobby.getNextPick();
			this.matchpoint = this.selectedLobby.getMatchPoint();
			this.hasWon = this.selectedLobby.teamHasWon();
		}

		// Scroll to the bottom - delay it by 500 ms or do it instantly
		if (delayScroll) {
			setTimeout(() => {
				this.scrollToTop();
			}, 500);
		}
		else {
			this.scrollToTop();
		}

		// Reset search bar
		this.searchValue = '';
	}

	/**
	 * Attempt to join a channel
	 */
	joinChannel() {
		const dialogRef = this.dialog.open(JoinIrcChannelComponent);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.attemptingToJoinChannel = result;
				this.ircService.joinChannel(result);
			}
		});
	}

	/**
	 * Part from a channel
	 * @param channelName the channel to part
	 */
	partChannel(channelName: string) {
		this.ircService.partChannel(channelName);

		if (this.selectedChannel != undefined && (this.selectedChannel.name == channelName)) {
			this.selectedChannel = undefined;
			this.chats = [];
		}
	}

	/**
	 * Send the entered message to the selected channel
	 */
	sendMessage(event: KeyboardEvent) {
		if (event.key == 'Enter') {
			if (this.chatMessage.nativeElement.value != '') {
				this.ircService.sendMessage(this.selectedChannel.name, this.chatMessage.nativeElement.value);
				this.chatMessage.nativeElement.value = '';
			}
		}
	}

	/**
	 * Drop a channel to rearrange it
	 * @param event
	 */
	dropChannel(event: CdkDragDrop<IrcChannel[]>) {
		moveItemInArray(this.channels, event.previousIndex, event.currentIndex);

		this.ircService.rearrangeChannels(this.channels);
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
	onMappoolChange(event: MatSelectChange) {
		this.selectedLobby.mappoolIndex = parseInt(event.value);
		this.selectedLobby.mappool = this.selectedLobby.tournament.getMappoolFromIndex(this.selectedLobby.mappoolIndex);

		this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);
	}

	/**
	 * Pick a beatmap from the given bracket
	 * @param beatmap the picked beatmap
	 * @param bracket the bracket where the beatmap is from
	 */
	pickBeatmap(beatmap: WyModBracketMap, bracket: WyModBracket, gamemode: number, forcePick = false) {
		// Prevent picking when firstPick isn't set
		if (this.selectedLobby.firstPick == undefined) {
			this.toastService.addToast('You haven\'t set who picks first yet.', ToastType.Error);

			const dialogRef = this.dialog.open(MultiplayerLobbySettingsComponent, {
				data: {
					multiplayerLobby: this.selectedLobby
				}
			});

			dialogRef.afterClosed().subscribe((result: Lobby) => {
				if (result != null) {
					this.multiplayerLobbies.updateMultiplayerLobby(result);
				}
			});

			return;
		}

		// Check if teams are allowed to pick from the same modbracket twice in a row
		if (this.selectedLobby.tournament.allowDoublePick == false) {
			if (this.wasBeatmapPickedFromSamePreviousModBracket(bracket) && forcePick == false) {
				const dialogRef = this.dialog.open(IrcPickMapSameModBracketComponent, {
					data: {
						beatmap: beatmap,
						modBracket: bracket,
						lobby: this.selectedLobby
					}
				});

				dialogRef.afterClosed().subscribe((result: boolean) => {
					if (result == true) {
						this.pickBeatmap(beatmap, bracket, gamemode, true);
					}
				});

				return;
			}
		}

		this.ircService.sendMessage(this.selectedChannel.name, `!mp map ${beatmap.beatmapId} ${gamemode}`);

		let modBit = 0;
		let freemodEnabled = false;

		for (const mod in bracket.mods) {
			if (bracket.mods[mod].value != 'freemod') {
				modBit += Number(bracket.mods[mod].value);
			}
			else {
				freemodEnabled = true;
			}
		}

		// Add an extra null check
		if (this.selectedLobby.teamOnePicks == null) {
			this.selectedLobby.teamOnePicks = [];
		}

		if (this.selectedLobby.teamTwoPicks == null) {
			this.selectedLobby.teamTwoPicks = [];
		}

		this.webhookService.sendBeatmapPicked(this.selectedLobby, this.ircService.authenticatedUser, this.selectedLobby.getNextPick(), beatmap);

		// Update picks
		if (this.selectedLobby.teamOneName == this.nextPick) {
			this.selectedLobby.teamOnePicks.push(beatmap.beatmapId);
		}
		else {
			this.selectedLobby.teamTwoPicks.push(beatmap.beatmapId);
		}

		this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);

		this.ircService.sendMessage(this.selectedChannel.name, `!mp mods ${modBit}${freemodEnabled ? ' freemod' : ''}`);
	}

	/**
	 * Check if the beatmap that is being picked came from the same mod bracket as the last pick was from
	 * @param bracket the bracket to check from
	 */
	wasBeatmapPickedFromSamePreviousModBracket(bracket: WyModBracket): boolean {
		if (this.selectedLobby.getNextPick() == this.selectedLobby.teamOneName) {
			if (this.selectedLobby.teamOnePicks.length <= 0) {
				return false;
			}

			const lastPick = this.selectedLobby.teamOnePicks[this.selectedLobby.teamOnePicks.length - 1];

			for (const beatmap of bracket.beatmaps) {
				if (beatmap.beatmapId == lastPick) {
					return true;
				}
			}
		}
		else if (this.selectedLobby.getNextPick() == this.selectedLobby.teamTwoName) {
			if (this.selectedLobby.teamTwoPicks.length <= 0) {
				return false;
			}

			const lastPick = this.selectedLobby.teamTwoPicks[this.selectedLobby.teamTwoPicks.length - 1];

			for (const beatmap of bracket.beatmaps) {
				if (beatmap.beatmapId == lastPick) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Unpick a beatmap
	 * @param beatmap
	 * @param bracket
	 */
	unpickBeatmap(beatmap: WyModBracketMap) {
		if (this.selectedLobby.teamOnePicks.indexOf(beatmap.beatmapId) > -1) {
			this.selectedLobby.teamOnePicks.splice(this.selectedLobby.teamOnePicks.indexOf(beatmap.beatmapId), 1);
		}
		else if (this.selectedLobby.teamTwoPicks.indexOf(beatmap.beatmapId) > -1) {
			this.selectedLobby.teamTwoPicks.splice(this.selectedLobby.teamTwoPicks.indexOf(beatmap.beatmapId), 1);
		}

		this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);
	}

	/**
	 * Change what team picked the map
	 * @param beatmap
	 * @param bracket
	 */
	changePickedBy(beatmap: WyModBracketMap) {
		if (this.selectedLobby.teamOnePicks.indexOf(beatmap.beatmapId) > -1) {
			this.selectedLobby.teamOnePicks.splice(this.selectedLobby.teamOnePicks.indexOf(beatmap.beatmapId), 1);
			this.selectedLobby.teamTwoPicks.push(beatmap.beatmapId);
		}
		else if (this.selectedLobby.teamTwoPicks.indexOf(beatmap.beatmapId) > -1) {
			this.selectedLobby.teamTwoPicks.splice(this.selectedLobby.teamTwoPicks.indexOf(beatmap.beatmapId), 1);
			this.selectedLobby.teamOnePicks.push(beatmap.beatmapId);
		}

		this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);
	}

	/**
	 * Change the room settings
	 */
	onRoomSettingChange() {
		if (!this.roomSettingGoingOn) {
			const timer =
				setInterval(() => {
					if (this.roomSettingDelay == 0) {
						this.ircService.sendMessage(this.selectedChannel.name, `!mp set ${this.teamMode.value} ${this.winCondition.value} ${this.players.value == undefined ? 8 : this.players.value}`);

						this.ircService.getChannelByName(this.selectedChannel.name).teamMode = this.teamMode.value;
						this.ircService.getChannelByName(this.selectedChannel.name).winCondition = this.winCondition.value;
						this.ircService.getChannelByName(this.selectedChannel.name).players = this.players.value;

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
		const lobbyId = this.multiplayerLobbies.getMultiplayerLobbyByIrc(this.selectedChannel.name).lobbyId;

		if (lobbyId) {
			this.router.navigate(['/lobby-overview/lobby-view', lobbyId]);
		}
		else {
			this.toastService.addToast('No lobby overview found for this irc channel');
		}
	}

	/**
	 * Refresh the stats for a multiplayer lobby.
	 * @param multiplayerLobby the multiplayerlobby
	 */
	refreshIrcHeader(multiplayerLobby: Lobby) {
		if (this.selectedLobby == undefined) return;

		if (this.selectedLobby.ircChannel == undefined) {
			this.selectedLobby.ircChannel = this.ircService.getChannelByName(this.selectedLobby.getLobbyName());
		}

		if (!this.selectedLobby.ircChannel.isPublicChannel && !this.selectedLobby.ircChannel.isPrivateChannel) {
			this.teamOneScore = multiplayerLobby.teamOneScore;
			this.teamTwoScore = multiplayerLobby.teamTwoScore;
			this.nextPick = multiplayerLobby.getNextPick();
			this.matchpoint = multiplayerLobby.getMatchPoint();
			this.hasWon = multiplayerLobby.teamHasWon();
		}
	}

	/**
	 * Play a sound when a message is being send to a specific channel
	 * @param channel the channel that should where a message should be send from
	 * @param status mute or unmute the sound
	 */
	playSound(channel: IrcChannel, status: boolean) {
		channel.playSoundOnMessage = status;
		this.storeService.set(`irc.channels.${channel.name}.playSoundOnMessage`, status);
		this.toastService.addToast(`${channel.name} will ${status == false ? 'no longer beep on message' : 'now beep on message'}.`);
	}

	/**
	 * Ban a beatmap
	 */
	banBeatmap(beatmap: WyModBracketMap, modBracket: WyModBracket, multiplayerLobby: Lobby) {
		const dialogRef = this.dialog.open(BanBeatmapComponent, {
			data: {
				beatmap: beatmap,
				modBracket: modBracket,
				multiplayerLobby: multiplayerLobby
			}
		});

		dialogRef.afterClosed().subscribe((result: BanBeatmapDialogData) => {
			if (result != null) {
				if (result.banForTeam == result.multiplayerLobby.teamOneName) {
					this.selectedLobby.teamOneBans.push(result.beatmap.beatmapId);
					this.webhookService.sendBanResult(result.multiplayerLobby, result.multiplayerLobby.teamOneName, result.beatmap, this.ircService.authenticatedUser);
				}
				else {
					this.selectedLobby.teamTwoBans.push(result.beatmap.beatmapId);
					this.webhookService.sendBanResult(result.multiplayerLobby, result.multiplayerLobby.teamTwoName, result.beatmap, this.ircService.authenticatedUser);
				}

				this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);
			}
		});
	}

	/**
	 * Check if a beatmap has been picked by team one in the current lobby
	 * @param multiplayerLobby the multiplayerlobby to check from
	 * @param beatmapId the beatmap to check
	 */
	beatmapIsPickedByTeamOne(multiplayerLobby: Lobby, beatmapId: number) {
		return multiplayerLobby.teamOnePicks != null && multiplayerLobby.teamOnePicks.indexOf(beatmapId) > -1;
	}

	/**
	 * Check if a beatmap has been picked by team two in the current lobby
	 * @param multiplayerLobby the multiplayerlobby to check from
	 * @param beatmapId the beatmap to check
	 */
	beatmapIsPickedByTeamTwo(multiplayerLobby: Lobby, beatmapId: number) {
		return multiplayerLobby.teamTwoPicks != null && multiplayerLobby.teamTwoPicks.indexOf(beatmapId) > -1;
	}

	/**
	 * Unban a beatmap
	 * @param beatmap
	 * @param bracket
	 */
	unbanBeatmap(beatmap: WyModBracketMap) {
		if (this.selectedLobby.teamOneBans.indexOf(beatmap.beatmapId) > -1) {
			this.selectedLobby.teamOneBans.splice(this.selectedLobby.teamOneBans.indexOf(beatmap.beatmapId), 1);
		}
		else if (this.selectedLobby.teamTwoBans.indexOf(beatmap.beatmapId) > -1) {
			this.selectedLobby.teamTwoBans.splice(this.selectedLobby.teamTwoBans.indexOf(beatmap.beatmapId), 1);
		}

		this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);
	}

	/**
	 * Pick a mystery map
	 * @param mappool the mappool to pick from
	 * @param modBracket the modbracket to pick from
	 */
	pickMysteryMap(mappool: WyMappool, modBracket: WyModBracket) {
		this.multiplayerLobbies.pickMysteryMap(mappool, modBracket, this.selectedLobby, this.ircService.authenticatedUser).subscribe((res: any) => {
			if (res.modCategory == null) {
				this.toastService.addToast(res.beatmapName, ToastType.Error, 60);
			}
			else {
				const modBracketMap = WyModBracketMap.makeTrueCopy(res);
				this.pickBeatmap(modBracketMap, modBracket, mappool.gamemodeId);

				// Pick a random map and update it to the cache
				this.selectedLobby.pickModCategoryFromBracket(modBracket, modBracketMap.modCategory);
				this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);
			}
		});
	}

	/**
	 * Pick a random map from the mod bracket
	 * @param mappool the mappool to pick from
	 * @param modBracket the modbracket to pick from
	 */
	pickRandomMap(modBracket: WyModBracket) {
		const randomMap: WyModBracketMap = modBracket.pickRandomMap(this.selectedLobby);

		if (randomMap == null) {
			this.toastService.addToast('Attempted to pick 30 random maps but could not find any. Did the mod bracket run out of maps to pick from?', ToastType.Error);
		}
		else {
			this.pickBeatmap(randomMap, modBracket, this.selectedLobby.tournament.gamemodeId, true);
		}
	}

	/**
	 * Toggle the player management tab
	 */
	togglePlayerManagement() {
		this.isPlayerManagementMinimized = !this.isPlayerManagementMinimized;

		if (!this.isPlayerManagementMinimized) {
			this.scrollToTop();
		}
	}

	/**
	 * Change the host to a different player
	 * @param player
	 */
	setHost(player: MultiplayerLobbyPlayersPlayer) {
		this.ircService.sendMessage(this.selectedChannel.name, `!mp host ${player.username}`);
	}

	/**
	 * Kick the player from the match
	 * @param player
	 */
	kickPlayer(player: MultiplayerLobbyPlayersPlayer) {
		this.ircService.sendMessage(this.selectedChannel.name, `!mp kick ${player.username}`);
	}

	/**
	 * Move the player to a different slot
	 * @param player
	 */
	movePlayer(player: MultiplayerLobbyPlayersPlayer) {
		const dialogRef = this.dialog.open(MultiplayerLobbyMovePlayerComponent, {
			data: {
				movePlayer: player,
				allPlayers: this.selectedLobby.multiplayerLobbyPlayers
			}
		});

		dialogRef.afterClosed().subscribe((result: MultiplayerLobbyMovePlayerDialogData) => {
			if (result != undefined) {
				this.ircService.sendMessage(this.selectedChannel.name, `!mp move ${result.movePlayer.username} ${result.moveToSlot}`);
			}
		});
	}

	/**
	 * Change the colour of the current player
	 * @param player
	 */
	changeTeam(player: MultiplayerLobbyPlayersPlayer) {
		const newTeamColour = player.team == 'Red' ? 'blue' : 'red';
		this.ircService.sendMessage(this.selectedChannel.name, `!mp team ${player.username} ${newTeamColour}`);
	}

	/**
	 * Scroll irc chat to top
	 */
	scrollToTop() {
		this.virtualScroller.scrollToIndex(this.chats.length - 1, true, 0, 0);
	}

	/**
	 * Open a dialog to easily send result to the multiplayer lobby
	 */
	sendMatchResult() {
		const selectedMultiplayerLobby = this.multiplayerLobbies.getMultiplayerLobbyByIrc(this.selectedChannel.name);

		this.dialog.open(SendBeatmapResultComponent, {
			data: {
				multiplayerLobby: selectedMultiplayerLobby,
				ircChannel: this.selectedChannel.name
			}
		});
	}

	/**
	 * Open a dialog to manage irc shortcut commands
	 */
	shortcutSettings(): void {
		const dialogRef = this.dialog.open(IrcShortcutDialogComponent);

		dialogRef.afterClosed().subscribe(result => {
			if (result == undefined) {
				this.ircShortcutCommandsService.loadIrcShortcutCommands();
			}
			else {
				this.ircShortcutCommandsService.saveIrcShortcutCommands();
			}
		});
	}

	/**
	 * Execute an irc shortcut command and process variables
	 * @param ircShortcutCommand the command that was executed
	 */
	executeIrcShortcutCommand(ircShortcutCommand: IrcShortcutCommand): void {
		if (!this.ircService.isAuthenticated) {
			return;
		}

		if (ircShortcutCommand.warning == true) {
			const dialogRef = this.dialog.open(IrcShortcutWarningDialogComponent, {
				data: {
					ircShortcutCommand: ircShortcutCommand,
					lobby: this.selectedLobby
				}
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result == true) {
					const ircCommand = ircShortcutCommand.parseIrcCommand(this.selectedLobby);
					this.ircService.sendMessage(this.selectedChannel.name, ircCommand);
				}
			});
		}
		else {
			const ircCommand = ircShortcutCommand.parseIrcCommand(this.selectedLobby);
			this.ircService.sendMessage(this.selectedChannel.name, ircCommand);
		}
	}

	/**
	 * Invite a player to the current multiplayer lobby
	 * @param player the player to invite
	 */
	invitePlayer(player: WyTeamPlayer): void {
		this.ircService.sendMessage(this.selectedChannel.name, `!mp invite ${player.name}`);
		this.toastService.addToast(`Invited ${player.name} to the multiplayer lobby.`);
	}

	/**
	 * Invite a player to the current multiplayer lobby
	 * @param player the player to invite
	 */
	assignPlayerAsCaptain(player: WyTeamPlayer, teamIndex: number): void {
		if (teamIndex == 1) {
			if (this.selectedLobby.teamOneCaptain != player) {
				this.selectedLobby.teamOneCaptain = player;

				this.toastService.addToast(`${player.name} has been assigned as captain for ${this.selectedLobby.teamOneName}.`);
			}
		}
		else {
			if (this.selectedLobby.teamTwoCaptain != player) {
				this.selectedLobby.teamTwoCaptain = player;

				this.toastService.addToast(`${player.name} has been assigned as captain for ${this.selectedLobby.teamTwoName}.`);
			}
		}
	}
}
