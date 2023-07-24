import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { IrcService } from '../../../../services/irc.service';
import { ElectronService } from '../../../../services/electron.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/toast.service';
import { StoreService } from '../../../../services/store.service';
import { ToastType } from '../../../../models/toast';
import { WebhookService } from '../../../../services/webhook.service';
import { MatDialog } from '@angular/material/dialog';
import { JoinIrcChannelComponent } from '../../../../components/dialogs/join-irc-channel/join-irc-channel.component';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { BanBeatmapComponent } from '../../../../components/dialogs/ban-beatmap/ban-beatmap.component';
import { SendBeatmapResultComponent } from '../../../../components/dialogs/send-beatmap-result/send-beatmap-result.component';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';
import { IrcChannel } from 'app/models/irc/irc-channel';
import { Lobby } from 'app/models/lobby';
import { IrcMessage } from 'app/models/irc/irc-message';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WyModBracketMap } from 'app/models/wytournament/mappool/wy-mod-bracket-map';
import { WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { IrcShortcutCommandsService } from 'app/services/irc-shortcut-commands.service';
import { MultiplayerLobbySettingsComponent } from '../../../../components/dialogs/multiplayer-lobby-settings/multiplayer-lobby-settings.component';
import { IrcPickMapSameModBracketComponent } from '../../../../components/dialogs/irc-pick-map-same-mod-bracket/irc-pick-map-same-mod-bracket.component';
import { WyTeamPlayer } from 'app/models/wytournament/wy-team-player';
import { MessageBuilder } from 'app/models/irc/message-builder';
import { IBanBeatmapDialogData } from 'app/interfaces/i-ban-beatmap-dialog-data';
import { MultiplayerLobbyPlayersService } from 'app/services/multiplayer-lobby-players.service';
import { SendFinalResultComponent } from 'app/components/dialogs/send-final-result/send-final-result.component';
import { IMultiplayerLobbySendFinalMessageDialogData } from 'app/interfaces/i-multiplayer-lobby-send-final-message-dialog-data';
import { Gamemodes } from 'app/models/osu-models/osu';
import { TournamentService } from 'app/services/tournament.service';
import { WyTeam } from 'app/models/wytournament/wy-team';
import { ChallongeService } from 'app/services/challonge.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SlashCommandService } from 'app/services/slash-command.service';
import { SlashCommand } from 'app/models/slash-command';

@Component({
	selector: 'app-irc',
	templateUrl: './irc.component.html',
	styleUrls: ['./irc.component.scss']
})
export class IrcComponent implements OnInit {
	@ViewChild('channelName') channelName: ElementRef;
	@ViewChild('chatMessage') chatMessage: ElementRef;

	@ViewChild('teamMode') teamMode: MatSelect;
	@ViewChild('winCondition') winCondition: MatSelect;
	@ViewChild('players') players: MatSelect;

	@ViewChild('normalVirtualScroller') private normalVirtualScroller: VirtualScrollerComponent;
	@ViewChild('banchoBotVirtualScroller') private banchoBotVirtualScroller: VirtualScrollerComponent;

	selectedChannel: IrcChannel;
	selectedLobby: Lobby;
	channels: IrcChannel[];

	normalChats: IrcMessage[] = [];
	normalViewPortItems: IrcMessage[];

	banchoBotChats: IrcMessage[] = [];
	banchoBotViewPortItems: IrcMessage[];

	chatLength = 0;
	keyPressed = false;

	isAttemptingToJoin = false;
	attemptingToJoinChannel: string;

	isInvitesMinimized = true;

	searchValue: string;

	roomSettingGoingOn = false;
	roomSettingDelay = 3;

	teamOneScore = 0;
	teamTwoScore = 0;

	teamOneHealth = 0;
	teamTwoHealth = 0;

	nextPick: string = null;
	matchpoint: string = null;
	tiebreaker = false;
	hasWon: string = null;

	popupBannedMap: WyModBracketMap = null;
	popupBannedBracket: WyModBracket = null;

	dividerHeightPercentage: number;

	qualifierPrefix = 'Qualifier lobby:';
	qualifierTeams: WyTeam[] = [];

	currentMessageHistoryIndex: number;

	slashCommandIndex: number;
	allSlashCommands: SlashCommand[];
	allSlashCommandsFiltered: SlashCommand[];
	activeSlashCommand: SlashCommand;

	constructor(
		public electronService: ElectronService,
		public ircService: IrcService,
		private storeService: StoreService,
		private multiplayerLobbies: WyMultiplayerLobbiesService,
		private router: Router,
		private toastService: ToastService,
		private webhookService: WebhookService,
		private dialog: MatDialog,
		public ircShortcutCommandsService: IrcShortcutCommandsService,
		private ref: ChangeDetectorRef,
		public multiplayerLobbyPlayersService: MultiplayerLobbyPlayersService,
		private tournamentService: TournamentService,
		private challongeService: ChallongeService,
		public slashCommandService: SlashCommandService) {
		this.channels = ircService.allChannels;

		const dividerHeightStore = this.storeService.get('dividerHeight');
		this.currentMessageHistoryIndex = -1;
		this.slashCommandIndex = -1;

		if (dividerHeightStore == undefined) {
			this.storeService.set('dividerHeight', 30);
			this.dividerHeightPercentage = 30;
		}
		else {
			this.dividerHeightPercentage = dividerHeightStore;
		}

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
			if (this.normalViewPortItems) {
				if (this.normalViewPortItems[this.normalViewPortItems.length - 1] === this.normalChats[this.normalChats.length - 2]) {
					this.scrollToTop();
				}

				if (this.selectedChannel && ircService.getChannelByName(this.selectedChannel.name).hasUnreadMessages) {
					ircService.getChannelByName(this.selectedChannel.name).hasUnreadMessages = false;
				}
			}

			if (this.banchoBotViewPortItems) {
				if (this.banchoBotViewPortItems[this.banchoBotViewPortItems.length - 1] === this.banchoBotChats[this.banchoBotChats.length - 2]) {
					this.scrollToTop();
				}

				if (this.selectedChannel && ircService.getChannelByName(this.selectedChannel.name).hasUnreadMessages) {
					ircService.getChannelByName(this.selectedChannel.name).hasUnreadMessages = false;
				}
			}
		});

		this.multiplayerLobbies.synchronizeIsCompleted().subscribe(data => {
			if (this.selectedLobby == undefined) {
				return;
			}

			if (data.lobbyId == this.selectedLobby.lobbyId) {
				this.selectedLobby = data;
				this.refreshIrcHeader(this.selectedLobby);
			}
		});

		// Trigger hasUnReadMessages for channels
		this.ircService.getChannelMessageUnread().subscribe(channel => {
			if ((channel != null && this.selectedChannel != null) && this.selectedChannel.name != channel.name) {
				for (const findChannel in this.channels) {
					if (this.channels[findChannel].name == channel.name) {
						this.channels[findChannel].hasUnreadMessages = true;
						this.ref.detectChanges();
						break;
					}
				}
			}
		});

		this.slashCommandService.registerCommand(new SlashCommand({
			name: 'savelog',
			description: 'Saves the chatlog of the current irc channel to a file',
			execute: () => slashCommandService.saveLog(this.selectedChannel)
		}));

		this.slashCommandService.registerCommand(new SlashCommand({
			name: 'savedebug',
			description: 'Saves debug data of the current multiplayer lobby to a file',
			execute: () => slashCommandService.saveDebug(this.selectedLobby, this.selectedChannel)
		}));

		this.allSlashCommands = this.slashCommandService.getSlashCommands();
		this.allSlashCommandsFiltered = this.slashCommandService.getSlashCommands();
	}

	/**
	 * Track which key has been pressed so we can navigate through the message history
	 *
	 * @param event what key has been pressed
	 */
	@HostListener('document:keyup', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		const modifiers = ['Shift', 'Alt', 'Control'];

		if (modifiers.some(modifier => event.getModifierState(modifier))) {
			return;
		}

		if (this.chatMessage.nativeElement.value.startsWith('/')) {
			this.allSlashCommandsFiltered = this.allSlashCommands.filter(command =>
				command.name.toLowerCase().includes(this.chatMessage.nativeElement.value.toLowerCase().substring(1)));

			if (event.key == 'ArrowUp') {
				this.navigateSlashCommandSelection(1);
			}
			else if (event.key == 'ArrowDown') {
				this.navigateSlashCommandSelection(-1);
			}
		}
		else {
			if (event.key == 'ArrowUp') {
				this.navigateMessageHistory(-1);
			}
			else if (event.key == 'ArrowDown') {
				this.navigateMessageHistory(1);
			}
		}
	}

	ngOnInit() {
		this.ircService.getIsJoiningChannel().subscribe(value => {
			this.isAttemptingToJoin = value;
		});
	}

	/**
	 * Prevent the arrow Up and Down from moving the cursor around
	 */
	preventDefault(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();
		}
	}

	/**
	 * Go back to normal menu
	 */
	goBack(): void {
		this.router.navigate(['/']);
	}

	/**
	 * Expand the divider by 5%
	 */
	expandDivider(): void {
		this.dividerHeightPercentage += 5;
		this.storeService.set('dividerHeight', this.dividerHeightPercentage);
	}

	/**
	 * Reset the divider to 30%
	 */
	resetDivider(): void {
		this.dividerHeightPercentage = 30;
		this.storeService.set('dividerHeight', this.dividerHeightPercentage);
	}

	/**
	 * Shrink the divider by 5%
	 */
	shrinkDivider(): void {
		this.dividerHeightPercentage -= 5;
		this.storeService.set('dividerHeight', this.dividerHeightPercentage);
	}

	/**
	 * Change the channel
	 *
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

		this.normalChats = this.selectedChannel.messages;
		this.banchoBotChats = this.selectedChannel.banchoBotMessages;

		this.refreshIrcHeader(this.selectedLobby);

		if (this.selectedLobby != undefined) {
			this.teamOneScore = this.selectedLobby.getTeamOneScore();
			this.teamTwoScore = this.selectedLobby.getTeamTwoScore();
			this.teamOneHealth = this.selectedLobby.getTeamOneHealth();
			this.teamTwoHealth = this.selectedLobby.getTeamOneHealth();
			this.nextPick = this.selectedLobby.getNextPick();
			this.matchpoint = this.selectedLobby.getMatchPoint();
			this.tiebreaker = this.selectedLobby.getTiebreaker();
			this.hasWon = this.selectedLobby.teamHasWon();

			if (this.selectedLobby.isQualifierLobby) {
				this.initializeQualifierTeams();
			}
		}

		// Scroll to the bottom - delay it by 500 ms or do it instantly
		if (delayScroll) {
			setTimeout(() => {
				this.scrollToTop();
				this.chatMessage.nativeElement.focus();
			}, 500);
		}
		else {
			this.scrollToTop();
			this.chatMessage.nativeElement.focus();
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
	 *
	 * @param channelName the channel to part
	 */
	partChannel(channelName: string) {
		this.ircService.partChannel(channelName);

		if (this.selectedChannel != undefined && (this.selectedChannel.name == channelName)) {
			this.selectedChannel = undefined;

			this.normalChats = [];
			this.banchoBotChats = [];
		}
	}

	/**
	 * Send the entered message to the selected channel
	 */
	sendMessage(event: KeyboardEvent) {
		if (event.key == 'Enter') {
			if (!this.ircService.isAuthenticated || (this.selectedChannel == undefined || !this.selectedChannel.active)) {
				return;
			}

			if (this.chatMessage.nativeElement.value.startsWith('/')) {
				if (this.activeSlashCommand) {
					this.chatMessage.nativeElement.value = `/${this.activeSlashCommand.name}`;

					this.activeSlashCommand = null;
					this.slashCommandIndex = -1;
				}
				else {
					const slashCommand = this.slashCommandService.getSlashCommand(this.chatMessage.nativeElement.value.substring(1));

					if (slashCommand != undefined) {
						slashCommand.execute();
						this.currentMessageHistoryIndex = -1;
					}

					this.chatMessage.nativeElement.value = '';
				}
			}
			else if (this.chatMessage.nativeElement.value != '') {
				this.ircService.sendMessage(this.selectedChannel.name, this.chatMessage.nativeElement.value);

				this.currentMessageHistoryIndex = -1;

				this.chatMessage.nativeElement.value = '';
			}
		}
	}

	/**
	 * Navigate through the message history and set the input to that value
	 *
	 * @param direction whether to go up or down in the message history
	 */
	navigateMessageHistory(direction: number): void {
		const messageHistory = this.selectedChannel.plainMessageHistory;
		const messageCount = messageHistory.length;

		this.currentMessageHistoryIndex -= direction;

		this.currentMessageHistoryIndex = Math.max(0, Math.min(this.currentMessageHistoryIndex, messageCount - 1));

		const inputElement = this.chatMessage.nativeElement;
		inputElement.value = messageHistory[messageCount - this.currentMessageHistoryIndex - 1];
		inputElement.selectionStart = inputElement.selectionEnd = inputElement.value.length;
	}

	/**
	 * Navigate through the slash commands
	 *
	 * @param direction whether to go up or down in the slash command selection
	 */
	navigateSlashCommandSelection(direction: number): void {
		this.slashCommandIndex = (this.slashCommandIndex + direction + this.allSlashCommandsFiltered.length) % this.allSlashCommandsFiltered.length;
		this.activeSlashCommand = this.allSlashCommandsFiltered[this.slashCommandIndex];
	}

	/**
	 * Select a slash command
	 *
	 * @param slashCommand the slash command to select
	 */
	selectSlashCommand(slashCommand: SlashCommand) {
		this.chatMessage.nativeElement.value = `/ ${slashCommand.name} `;
		this.chatMessage.nativeElement.focus();
	}

	/**
	 * Drop a channel to rearrange it
	 *
	 * @param event
	 */
	dropChannel(event: CdkDragDrop<IrcChannel[]>) {
		moveItemInArray(this.channels, event.previousIndex, event.currentIndex);

		this.ircService.rearrangeChannels(this.channels);
	}

	/**
	 * Open the link to the users userpage
	 *
	 * @param username
	 */
	openUserpage(username: string) {
		this.electronService.openLink(`https://osu.ppy.sh/users/${username}`);
	}

	/**
	 * Change the current mappool
	 *
	 * @param event
	 */
	onMappoolChange(event: MatSelectChange) {
		this.selectedLobby.mappoolIndex = parseInt(event.value);
		this.selectedLobby.mappool = this.selectedLobby.tournament.getMappoolFromIndex(this.selectedLobby.mappoolIndex);

		this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);
	}

	/**
	 * Pick a beatmap from the given bracket
	 *
	 * @param beatmap the picked beatmap
	 * @param bracket the bracket where the beatmap is from
	 */
	pickBeatmap(beatmap: WyModBracketMap, bracket: WyModBracket, gamemode: number, forcePick = false) {
		// Prevent picking when firstPick isn't set
		if (this.selectedLobby.firstPick == undefined && (this.selectedLobby.isQualifierLobby == undefined || this.selectedLobby.isQualifierLobby == false)) {
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

		if (this.selectedLobby.tournament.gamemodeId == Gamemodes.AllModes) {
			const gamemodeId = beatmap.gamemodeId != null && beatmap.gamemodeId != undefined ? beatmap.gamemodeId : 0;
			this.ircService.sendMessage(this.selectedChannel.name, `!mp map ${beatmap.beatmapId} ${gamemodeId}`);
		}
		else {
			this.ircService.sendMessage(this.selectedChannel.name, `!mp map ${beatmap.beatmapId} ${gamemode}`);
		}

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
	 *
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
	 *
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
	 *
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
						this.ircService.sendMessage(this.selectedChannel.name, `!mp set ${this.teamMode.value as string} ${this.winCondition.value as string} ${this.players.value == undefined ? 8 : this.players.value as string}`);

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
	 *
	 * @param multiplayerLobby the multiplayerlobby
	 */
	refreshIrcHeader(multiplayerLobby: Lobby) {
		if (this.selectedLobby == undefined) {
			return;
		}

		if (this.selectedLobby.ircChannel == undefined || this.selectedLobby.ircChannel == null) {
			this.selectedLobby.ircChannel = this.ircService.getChannelByName(`#mp_${Lobby.getMultiplayerIdFromLink(this.selectedLobby.multiplayerLink)}`);
		}

		if (!this.selectedLobby.ircChannel.isPublicChannel && !this.selectedLobby.ircChannel.isPrivateChannel) {
			this.teamOneScore = multiplayerLobby.getTeamOneScore();
			this.teamTwoScore = multiplayerLobby.getTeamTwoScore();
			this.teamOneHealth = this.selectedLobby.getTeamOneHealth();
			this.teamTwoHealth = this.selectedLobby.getTeamOneHealth();
			this.nextPick = multiplayerLobby.getNextPick();
			this.matchpoint = multiplayerLobby.getMatchPoint();
			this.tiebreaker = multiplayerLobby.getTiebreaker();
			this.hasWon = multiplayerLobby.teamHasWon();
		}

		if (this.selectedLobby.isQualifierLobby == false) {
			if (this.selectedLobby.tournament.hasWyBinConnected()) {
				this.challongeService.updateMatchScore(this.selectedLobby.tournament.wyBinTournamentId, this.selectedLobby.selectedStage.name, this.selectedLobby.teamOneName, this.selectedLobby.teamTwoName, this.selectedLobby.getTeamOneScore(), this.selectedLobby.getTeamTwoScore(), this.selectedLobby.teamHasWon()).subscribe(() => {
				}, (error: HttpErrorResponse) => {
					this.toastService.addToast('Unable to update the match score to Challonge: ' + error.error.message, ToastType.Error);
				});
			}
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
		this.storeService.set(`irc.channels.${channel.name}.playSoundOnMessage`, status);
		this.toastService.addToast(`${channel.name} will ${status == false ? 'no longer beep on message' : 'now beep on message'}.`);
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
			this.storeService.set(`irc.channels.${channel.name}.label`, channel.label);
		} else {
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
			this.storeService.set(`irc.channels.${channel.name}.label`, channel.label);
		}
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

		dialogRef.afterClosed().subscribe((result: IBanBeatmapDialogData) => {
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
	 *
	 * @param multiplayerLobby the multiplayerlobby to check from
	 * @param beatmapId the beatmap to check
	 */
	beatmapIsPickedByTeamOne(multiplayerLobby: Lobby, beatmapId: number) {
		return multiplayerLobby.teamOnePicks != null && multiplayerLobby.teamOnePicks.indexOf(beatmapId) > -1;
	}

	/**
	 * Check if a beatmap has been picked by team two in the current lobby
	 *
	 * @param multiplayerLobby the multiplayerlobby to check from
	 * @param beatmapId the beatmap to check
	 */
	beatmapIsPickedByTeamTwo(multiplayerLobby: Lobby, beatmapId: number) {
		return multiplayerLobby.teamTwoPicks != null && multiplayerLobby.teamTwoPicks.indexOf(beatmapId) > -1;
	}

	/**
	 * Unban a beatmap
	 *
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
	 *
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
	 *
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
	 * Scroll irc chat to top
	 */
	scrollToTop() {
		if (this.normalVirtualScroller != undefined) {
			this.normalVirtualScroller.scrollToIndex(this.normalChats.length - 1, true, 0, 0);
		}

		if (this.banchoBotVirtualScroller != undefined) {
			this.banchoBotVirtualScroller.scrollToIndex(this.banchoBotChats.length - 1, true, 0, 0);
		}
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
	 * Send the match summary to the given Discord webhooks
	 */
	sendMatchSummary() {
		const selectedMultiplayerLobby = this.multiplayerLobbies.getMultiplayerLobbyByIrc(this.selectedChannel.name);
		this.webhookService.sendMatchSummary(selectedMultiplayerLobby, this.ircService.authenticatedUser);
	}

	/**
	 * Send the final result to discord
	 */
	sendFinalResult() {
		const selectedMultiplayerLobby = this.multiplayerLobbies.getMultiplayerLobbyByIrc(this.selectedChannel.name);

		const dialogRef = this.dialog.open(SendFinalResultComponent, {
			data: {
				multiplayerLobby: selectedMultiplayerLobby
			}
		});

		dialogRef.afterClosed().subscribe((result: IMultiplayerLobbySendFinalMessageDialogData) => {
			if (result != undefined) {
				if (result.qualifierLobby) {
					this.webhookService.sendQualifierResult(result.multiplayerLobby, result.extraMessage, this.ircService.authenticatedUser);
				}
				else {
					if (result.winByDefault) {
						this.webhookService.sendWinByDefaultResult(result.multiplayerLobby, result.extraMessage, result.winningTeam, result.losingTeam, this.ircService.authenticatedUser);
					}
					else {
						this.webhookService.sendFinalResult(result.multiplayerLobby, result.extraMessage, this.ircService.authenticatedUser);
					}
				}
			}
		});
	}

	/**
	 * Synchronizes the multiplayer lobby and calculates all the scores
	 */
	synchronizeMp() {
		this.toastService.addToast('Synchronizing multiplayer lobby...');

		// console.time('synchronize-lobby');
		this.multiplayerLobbies.synchronizeMultiplayerMatch(this.selectedLobby, true, false);
		// console.timeEnd('synchronize-lobby');
	}

	/**
	 * Focus the chat
	 *
	 * @param focus whether to focus
	 */
	focusChat(focus: boolean): void {
		if (focus == true) {
			this.chatMessage.nativeElement.focus();
		}
	}

	/**
	 * Invite a player to the current multiplayer lobby
	 *
	 * @param player the player to invite
	 */
	invitePlayer(player: WyTeamPlayer): void {
		if (player.userId == null || player.userId == undefined) {
			this.ircService.sendMessage(this.selectedChannel.name, `!mp invite ${player.name}`);
		}
		else {
			this.ircService.sendMessage(this.selectedChannel.name, `!mp invite #${player.userId}`);
		}

		this.toastService.addToast(`Invited ${player.name} to the multiplayer lobby.`);
	}

	/**
	 * Invite a player to the current multiplayer lobby
	 *
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

	/**
	 * Open lobby options dialog
	 */
	openLobbyDialog(): void {
		const dialogRef = this.dialog.open(MultiplayerLobbySettingsComponent, {
			data: {
				multiplayerLobby: this.selectedLobby
			}
		});

		dialogRef.afterClosed().subscribe((result: Lobby) => {
			if (result != null) {
				this.multiplayerLobbies.updateMultiplayerLobby(result);
				this.refreshIrcHeader(this.selectedLobby);
			}
		});
	}

	/**
	 * Pick a beatmap from the given acronym typed in irc (HR1/MM2/DT3/etc.)
	 *
	 * @param chatPiece a MessageBuilder from irc to pick the map
	 */
	pickBeatmapFromAcronym(chatPiece: MessageBuilder) {
		if (this.selectedLobby.mappool.id == chatPiece.modAcronymMappoolId) {
			for (const modBracket of this.selectedLobby.mappool.modBrackets) {
				if (modBracket.id == chatPiece.modAcronymModBracketId) {
					for (const map of modBracket.beatmaps) {
						if (map.beatmapId == chatPiece.modAcronymBeatmapId) {
							this.pickBeatmap(map, modBracket, chatPiece.modAcronymGameMode);
							return;
						}
					}
				}
			}
		}
		else {
			for (const mappool of this.selectedLobby.tournament.mappools) {
				if (mappool.id == chatPiece.modAcronymMappoolId) {
					for (const modBracket of mappool.modBrackets) {
						if (modBracket.id == chatPiece.modAcronymModBracketId) {
							for (const map of modBracket.beatmaps) {
								if (map.beatmapId == chatPiece.modAcronymBeatmapId) {
									this.pickBeatmap(map, modBracket, chatPiece.modAcronymGameMode);
									return;
								}
							}
						}
					}
				}
			}
		}

		this.toastService.addToast(`Unable to pick ${chatPiece.message}.`);
	}

	/**
	 * Synchronize the given lobby
	 *
	 * @param lobby the lobby to synchronize
	 */
	synchronizeLobby(lobby: Lobby) {
		this.multiplayerLobbies.synchronizeMultiplayerMatch(lobby, true);
	}

	/**
	 * Adjust the score for the selected team
	 *
	 * @param team the team to adjust the score for
	 * @param mouseClick left or right to increase or decrease
	 */
	adjustScore(team: number, mouseClick: string) {
		if (mouseClick == 'left') {
			if (team == 1) {
				this.selectedLobby.teamOneOverwriteScore++;
			}
			else if (team == 2) {
				this.selectedLobby.teamTwoOverwriteScore++;
			}
		}
		else if (mouseClick == 'right') {
			if (team == 1) {
				this.selectedLobby.teamOneOverwriteScore--;
			}
			else if (team == 2) {
				this.selectedLobby.teamTwoOverwriteScore--;
			}
		}
		else if (mouseClick == 'middle') {
			if (team == 1) {
				this.selectedLobby.teamOneOverwriteScore = 0;
			}
			else if (team == 2) {
				this.selectedLobby.teamTwoOverwriteScore = 0;
			}
		}

		this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);
		this.refreshIrcHeader(this.selectedLobby);
	}

	/**
	 * Adjust the health for the selected team
	 *
	 * @param team the team to adjust the health for
	 * @param mouseClick left or right to increase or decrease
	 */
	adjustHealth(team: number, mouseClick: string) {
		if (mouseClick == 'left') {
			if (team == 1) {
				this.selectedLobby.teamOneOverwriteHealth++;
			}
			else if (team == 2) {
				this.selectedLobby.teamTwoOverwriteHealth++;
			}
		}
		else if (mouseClick == 'right') {
			if (team == 1) {
				this.selectedLobby.teamOneOverwriteHealth--;
			}
			else if (team == 2) {
				this.selectedLobby.teamTwoOverwriteHealth--;
			}
		}
		else if (mouseClick == 'middle') {
			if (team == 1) {
				this.selectedLobby.teamOneOverwriteHealth = 0;
			}
			else if (team == 2) {
				this.selectedLobby.teamTwoOverwriteHealth = 0;
			}
		}

		this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);
		this.refreshIrcHeader(this.selectedLobby);
	}

	/**
	 * Initialized the qualifier teams in the dropdown
	 */
	initializeQualifierTeams(): void {
		this.qualifierTeams = [];

		const qualifierIdentifier = this.selectedLobby.description.substring(this.qualifierPrefix.length).trim();

		this.tournamentService.getWyBinQualifierLobbyTeams(this.selectedLobby.tournament.wyBinTournamentId, qualifierIdentifier).subscribe(teams => {
			for (const team in teams) {
				const iTeam = teams[team];

				const newTeam = new WyTeam({
					name: iTeam.name
				});

				for (const player in iTeam.teamMembers) {
					const iPlayer = iTeam.teamMembers[player];

					const newPlayer = new WyTeamPlayer({
						name: iPlayer.user.userOsu.username,
						userId: iPlayer.user.userOsu.id
					});

					newTeam.players.push(newPlayer);
				}

				this.qualifierTeams.push(newTeam);
			}
		});
	}
}

