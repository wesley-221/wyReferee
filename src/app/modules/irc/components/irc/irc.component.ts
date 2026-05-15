import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, TemplateRef } from '@angular/core';
import { IrcService } from '../../../../services/irc.service';
import { ElectronService } from '../../../../services/electron.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/toast.service';
import { ToastType } from '../../../../models/toast';
import { WebhookService } from '../../../../services/webhook.service';
import { MatDialog } from '@angular/material/dialog';
import { JoinIrcChannelComponent } from '../../../../components/dialogs/join-irc-channel/join-irc-channel.component';
import { MatSelectChange } from '@angular/material/select';
import { BanBeatmapComponent } from '../../../../components/dialogs/ban-beatmap/ban-beatmap.component';
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
import { IMultiplayerLobbySendFinalMessageDialogData } from 'app/interfaces/i-multiplayer-lobby-send-final-message-dialog-data';
import { Gamemodes } from 'app/models/osu-models/osu';
import { TournamentService } from 'app/services/tournament.service';
import { WyTeam } from 'app/models/wytournament/wy-team';
import { ChallongeService } from 'app/services/challonge.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SlashCommandService } from 'app/services/slash-command.service';
import { SlashCommand } from 'app/models/slash-command';
import { ProtectBeatmapDialogComponent } from 'app/components/dialogs/protect-beatmap-dialog/protect-beatmap-dialog.component';
import { IProtectBeatmapDialogData } from 'app/interfaces/i-protect-beatmap-dialog-data';
import { CacheService } from 'app/services/cache.service';
import { MultiplayerData } from 'app/models/store-multiplayer/multiplayer-data';
import { WyTriggerMessage } from 'app/models/wytournament/trigger-message';
import { Subject, combineLatest, map, take, takeUntil } from 'rxjs';
import { UpdateMatchResultsDialogComponent } from 'app/components/dialogs/update-match-results-dialog/update-match-results-dialog.component';
import { IrcChatContainerComponent } from '../irc-chat-container/irc-chat-container.component';
import { IrcChatControlsComponent } from '../irc-chat-controls/irc-chat-controls.component';
import { GenericService } from '../../../../services/generic.service';
import { IrcLayoutService } from '../../../../services/irc-layout.service';
import { IrcLayoutSection, IrcLayoutSectionViewType } from '../../../../models/irc-layout-section';

@Component({
	selector: 'app-irc',
	templateUrl: './irc.component.html',
	styleUrls: ['./irc.component.scss']
})
export class IrcComponent implements OnInit, OnDestroy {
	@ViewChild('ircChannelsTemplate', { static: true }) private ircChannelsTemplate!: TemplateRef<unknown>;
	@ViewChild('playerManagementTemplate', { static: true }) private playerManagementTemplate!: TemplateRef<unknown>;
	@ViewChild('matchSettingsTemplate', { static: true }) private matchSettingsTemplate!: TemplateRef<unknown>;
	@ViewChild('matchSettingsGeneralInteractionsTemplate', { static: true }) private matchSettingsGeneralInteractionsTemplate!: TemplateRef<unknown>;
	@ViewChild('matchSettingsMultiplayerLobbySettingsTemplate', { static: true }) private matchSettingsMultiplayerLobbySettingsTemplate!: TemplateRef<unknown>;
	@ViewChild('matchSettingsPlayersInvitationTemplate', { static: true }) private matchSettingsPlayersInvitationTemplate!: TemplateRef<unknown>;
	@ViewChild('mappoolTemplate', { static: true }) private mappoolTemplate!: TemplateRef<unknown>;

	@ViewChild(IrcChatContainerComponent) ircChatContainerComponent: IrcChatContainerComponent;
	@ViewChild(IrcChatControlsComponent) ircChatControlsComponent: IrcChatControlsComponent;

	unsubscribeOnDestroy$ = new Subject<void>();

	selectedChannel: IrcChannel;
	selectedLobby: Lobby;
	channels: IrcChannel[];

	normalChats: IrcMessage[] = [];
	banchoBotChats: IrcMessage[] = [];

	chatLength = 0;
	keyPressed = false;

	isAttemptingToJoin = false;
	attemptingToJoinChannel: string;

	isInvitesMinimized = true;

	searchValue: string;

	teamOneHealth = 0;
	teamTwoHealth = 0;

	popupBannedMap: WyModBracketMap = null;
	popupBannedBracket: WyModBracket = null;

	qualifierPrefix = 'Qualifier lobby:';
	qualifierTeams: WyTeam[] = [];

	currentMessageHistoryIndex: number;

	slashCommandIndex: number;
	allSlashCommands: SlashCommand[];
	allSlashCommandsFiltered: SlashCommand[];
	activeSlashCommand: SlashCommand;

	matchDialogHeaderName: string;
	matchDialogMultiplayerData: MultiplayerData;
	matchDialogSendFinalResult: boolean;

	sidebarLeftWidth = 250;
	sidebarRightWidth = 250;

	private sidebarSections = this.ircLayoutService.sidebarSections$;

	sidebarLeftSections = this.sidebarSections.pipe(
		map(sections => sections.filter(section => section.sidebar === 'left')),
		map(sections => sections.sort((a, b) => a.order - b.order))
	);

	sidebarRightSections = this.sidebarSections.pipe(
		map(sections => sections.filter(section => section.sidebar === 'right')),
		map(sections => sections.sort((a, b) => a.order - b.order))
	);

	layoutEditorOpen = false;

	constructor(
		public electronService: ElectronService,
		public ircService: IrcService,
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
		public slashCommandService: SlashCommandService,
		public cacheService: CacheService,
		private genericService: GenericService,
		private ircLayoutService: IrcLayoutService) {
		this.currentMessageHistoryIndex = -1;
		this.slashCommandIndex = -1;

		this.matchDialogSendFinalResult = false;

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

		combineLatest([
			this.genericService.getIrcSidebarWidth('left'),
			this.genericService.getIrcSidebarWidth('right')
		])
			.pipe(take(1))
			.subscribe(([leftWidth, rightWidth]) => {
				this.sidebarLeftWidth = leftWidth;
				this.sidebarRightWidth = rightWidth;
			});
	}

	/**
	 * Track which key has been pressed so we can navigate through the message history
	 *
	 * @param event what key has been pressed
	 */
	// @HostListener('document:keyup', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		const modifiers = ['Shift', 'Alt', 'Control'];

		if (modifiers.some(modifier => event.getModifierState(modifier))) {
			return;
		}

		if (this.ircChatControlsComponent.chatMessage.nativeElement.value.startsWith('/')) {
			this.allSlashCommandsFiltered = this.allSlashCommands.filter(command =>
				command.name.toLowerCase().includes(this.ircChatControlsComponent.chatMessage.nativeElement.value.toLowerCase().substring(1)));

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
		this.channels = this.ircService.allChannels;

		this.ircService.getIsJoiningChannel()
			.pipe(takeUntil(this.unsubscribeOnDestroy$))
			.subscribe(value => {
				this.isAttemptingToJoin = value;
			});

		this.ircService.getIsAuthenticated()
			.pipe(takeUntil(this.unsubscribeOnDestroy$))
			.subscribe(isAuthenticated => {
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
		this.ircService.hasMessageBeenSend()
			.pipe(takeUntil(this.unsubscribeOnDestroy$))
			.subscribe(sent => {
				const channel = this.selectedChannel ? this.ircService.getChannelByName(this.selectedChannel.name) : null;

				// Mark current channel as read
				if (channel && channel.hasUnreadMessages) {
					channel.hasUnreadMessages = false;
				}

				if (sent == true) {
					// Detect changes to update the view, scroll to bottom after this
					this.ref.detectChanges();
				}

				this.scrollToBottom();
			});

		this.multiplayerLobbies.synchronizeIsCompleted()
			.pipe(takeUntil(this.unsubscribeOnDestroy$))
			.subscribe((data: Lobby) => {
				if (data == null || data == undefined) {
					return;
				}

				if (this.selectedLobby == undefined || this.selectedLobby == null) {
					return;
				}

				if (data.lobbyId == this.selectedLobby.lobbyId) {
					this.selectedLobby = data;
					this.refreshIrcHeader(this.selectedLobby);

					if (this.selectedLobby && this.selectedLobby.hasWyBinConnected()) {
						if (this.selectedLobby.isQualifierLobby == false) {
							this.matchDialogHeaderName = 'Last played beatmap';
							this.matchDialogMultiplayerData = this.selectedLobby.getLastPlayedBeatmap();
							this.matchDialogSendFinalResult = false;

							this.ref.detectChanges();
						}
					}
				}
			});

		// Trigger hasUnReadMessages for channels
		this.ircService.getChannelMessageUnread()
			.pipe(takeUntil(this.unsubscribeOnDestroy$))
			.subscribe(channel => {
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
	}

	ngOnDestroy(): void {
		this.unsubscribeOnDestroy$.next();
		this.unsubscribeOnDestroy$.complete();
	}

	/**
	 * Go back to normal menu
	 */
	goBack(): void {
		this.router.navigate(['/']);
	}

	/**
	 * Change the channel
	 *
	 * @param channel the channel to change to
	 */
	changeChannel(channel: string, delayScroll = false) {
		if (this.selectedChannel?.name == channel) {
			return;
		}

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
			this.ircService.teamOneScore$.next(this.selectedLobby.getTeamOneScore());
			this.ircService.teamTwoScore$.next(this.selectedLobby.getTeamTwoScore());
			this.teamOneHealth = this.selectedLobby.getTeamOneHealth();
			this.teamTwoHealth = this.selectedLobby.getTeamOneHealth();
			this.ircService.nextPick$.next(this.selectedLobby.getNextPick());
			this.ircService.matchPoint$.next(this.selectedLobby.getMatchPoint());
			this.ircService.tiebreaker$.next(this.selectedLobby.getTiebreaker());
			this.ircService.hasWon$.next(this.selectedLobby.teamHasWon());

			if (this.selectedLobby.isQualifierLobby) {
				if (this.selectedLobby.hasWyBinConnected()) {
					this.initializeQualifierTeams();
				}
			}
		}

		this.closeMatchDialog();

		// Scroll to the bottom - delay it by 500 ms or do it instantly
		if (delayScroll) {
			setTimeout(() => {
				this.scrollToBottom();
				this.ircChatControlsComponent?.chatMessage.nativeElement.focus();
			}, 500);
		}
		else {
			this.scrollToBottom();
			this.ircChatControlsComponent?.chatMessage.nativeElement.focus();
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
	 * Send the entered message to the selected channel
	 */
	sendMessage(event: KeyboardEvent) {
		if (event.key == 'Enter') {
			if (this.ircChatControlsComponent.chatMessage.nativeElement.value.startsWith('/')) {
				if (this.activeSlashCommand) {
					this.ircChatControlsComponent.chatMessage.nativeElement.value = `/${this.activeSlashCommand.name}`;

					this.activeSlashCommand = null;
					this.slashCommandIndex = -1;
				}
				else {
					const slashCommand = this.slashCommandService.getSlashCommand(this.ircChatControlsComponent.chatMessage.nativeElement.value.substring(1));

					if (slashCommand != undefined) {
						slashCommand.execute();
						this.currentMessageHistoryIndex = -1;
					}

					this.ircChatControlsComponent.chatMessage.nativeElement.value = '';
				}
			}
			else if (this.ircChatControlsComponent.chatMessage.nativeElement.value != '') {
				if (!this.ircService.isAuthenticated || (this.selectedChannel == undefined || !this.selectedChannel.active)) {
					return;
				}

				this.ircService.sendMessage(this.selectedChannel.name, this.ircChatControlsComponent.chatMessage.nativeElement.value);

				this.currentMessageHistoryIndex = -1;

				this.ircChatControlsComponent.chatMessage.nativeElement.value = '';
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

		const inputElement = this.ircChatControlsComponent.chatMessage.nativeElement;
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
		this.ircChatControlsComponent.chatMessage.nativeElement.value = `/${slashCommand.name}`;
		this.ircChatControlsComponent.chatMessage.nativeElement.focus();
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
		// Check whether the beatmap is banned
		if (this.selectedLobby.beatmapIsBanned(beatmap.beatmapId)) {
			return;
		}

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

		// // Prevent picking when the not enough maps have been banned
		// if (this.selectedLobby.banCount != undefined && this.selectedLobby.banCount != null) {
		// 	let bansNotMet = false;

		// 	if (this.selectedLobby.teamOneBans.length < this.selectedLobby.banCount) {
		// 		this.toastService.addToast(`${this.selectedLobby.teamOneName} has not banned ${this.selectedLobby.banCount} map(s) yet.`, ToastType.Error, 10);
		// 		bansNotMet = true;
		// 	}

		// 	if (this.selectedLobby.teamTwoBans.length < this.selectedLobby.banCount) {
		// 		this.toastService.addToast(`${this.selectedLobby.teamTwoName} has not banned ${this.selectedLobby.banCount} map(s) yet.`, ToastType.Error, 10);
		// 		bansNotMet = true;
		// 	}

		// 	if (bansNotMet == true) {
		// 		return;
		// 	}
		// }

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

		if (this.selectedLobby.tournament.gamemodeId == Gamemodes.AllModes as number) {
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
		if (this.selectedLobby.teamOneName == this.ircService.nextPick$.value) {
			this.selectedLobby.teamOnePicks.push(beatmap.beatmapId);
		}
		else {
			this.selectedLobby.teamTwoPicks.push(beatmap.beatmapId);
		}

		this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);

		this.ircService.sendMessage(this.selectedChannel.name, `!mp mods ${modBit}${freemodEnabled ? ' freemod' : ''}`);

		// Send the trigger messages if applicable
		for (const triggerMessage of this.selectedLobby.tournament.triggerMessages) {
			const finalMessage = triggerMessage.message;

			if (triggerMessage.beatmapPicked) {
				this.ircService.sendMessage(this.selectedChannel.name, finalMessage);
			}
		}
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
			this.ircService.teamOneScore$.next(multiplayerLobby.getTeamOneScore());
			this.ircService.teamTwoScore$.next(multiplayerLobby.getTeamTwoScore());
			this.teamOneHealth = this.selectedLobby.getTeamOneHealth();
			this.teamTwoHealth = this.selectedLobby.getTeamOneHealth();
			this.ircService.nextPick$.next(multiplayerLobby.getNextPick());
			this.ircService.matchPoint$.next(multiplayerLobby.getMatchPoint());
			this.ircService.tiebreaker$.next(multiplayerLobby.getTiebreaker());
			this.ircService.hasWon$.next(multiplayerLobby.teamHasWon());
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
	 * Protect the given beatmap
	 *
	 * @param beatmap the beatmap to protect
	 * @param modBracket the mod bracket the beatmap belongs to
	 * @param multiplayerLobby the lobby the beatmap should be protected in
	 */
	protectBeatmap(beatmap: WyModBracketMap, modBracket: WyModBracket, multiplayerLobby: Lobby) {
		const dialogRef = this.dialog.open(ProtectBeatmapDialogComponent, {
			data: {
				beatmap: beatmap,
				modBracket: modBracket,
				multiplayerLobby: multiplayerLobby
			}
		});

		dialogRef.afterClosed().subscribe((result: IProtectBeatmapDialogData) => {
			if (result != null) {
				if (result.protectForTeam == result.multiplayerLobby.teamOneName) {
					this.selectedLobby.teamOneProtects.push(result.beatmap.beatmapId);
					this.webhookService.sendProtectResult(result.multiplayerLobby, result.multiplayerLobby.teamOneName, result.beatmap, this.ircService.authenticatedUser);
				}
				else {
					this.selectedLobby.teamTwoProtects.push(result.beatmap.beatmapId);
					this.webhookService.sendProtectResult(result.multiplayerLobby, result.multiplayerLobby.teamTwoName, result.beatmap, this.ircService.authenticatedUser);
				}

				this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);
			}
		});
	}

	/**
	 * Unprotect a beatmap
	 *
	 * @param beatmap the beatmap to unprotect
	 */
	unprotectBeatmap(beatmap: WyModBracketMap) {
		if (this.selectedLobby.teamOneProtects.indexOf(beatmap.beatmapId) > -1) {
			this.selectedLobby.teamOneProtects.splice(this.selectedLobby.teamOneProtects.indexOf(beatmap.beatmapId), 1);
		}
		else if (this.selectedLobby.teamTwoProtects.indexOf(beatmap.beatmapId) > -1) {
			this.selectedLobby.teamTwoProtects.splice(this.selectedLobby.teamTwoProtects.indexOf(beatmap.beatmapId), 1);
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
	scrollToBottom() {
		if (this.ircChatContainerComponent) {
			this.ircChatContainerComponent.scrollToBottom();
		}
	}

	/**
	 * Update the match results in the lobby
	 */
	updateMatchResults() {
		const selectedMultiplayerLobby = this.multiplayerLobbies.getMultiplayerLobbyByIrc(this.selectedChannel.name);

		const dialogRef = this.dialog.open(UpdateMatchResultsDialogComponent, {
			data: {
				multiplayerLobby: selectedMultiplayerLobby
			}
		});

		dialogRef.afterClosed().subscribe((result: IMultiplayerLobbySendFinalMessageDialogData) => {
			if (result != undefined) {
				if (result.winByDefault) {
					this.webhookService.sendWinByDefaultResult(result.multiplayerLobby, result.extraMessage, result.winningTeam, result.losingTeam, this.ircService.authenticatedUser);
				}
				else {
					this.webhookService.sendFinalResult(result.multiplayerLobby, result.extraMessage, this.ircService.authenticatedUser);
				}

				if (this.selectedLobby.hasWyBinConnected()) {
					this.challongeService.updateMatchScore(this.selectedLobby.tournament.wyBinTournamentId, this.selectedLobby.wybinStageId, this.selectedLobby.wybinMatchId, this.selectedLobby.selectedStage.name, this.selectedLobby.teamOneName, this.selectedLobby.teamTwoName, this.selectedLobby.getTeamOneScore(), this.selectedLobby.getTeamTwoScore(), this.selectedLobby.teamHasWon()).subscribe({
						next: () => {
							this.toastService.addToast(`Successfully updated the match results for ${result.multiplayerLobby.getQualifierName()}`);
						},
						error: (error: HttpErrorResponse) => {
							this.toastService.addToast('Unable to update the match score to Challonge: ' + error.error.message, ToastType.Error);
						}
					});
				}
			}
		});

		this.closeMatchDialog();
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
	 * Closes the match dialog
	 */
	closeMatchDialog() {
		if (this.selectedLobby && this.selectedLobby.hasWyBinConnected()) {
			if (this.selectedLobby.isQualifierLobby == true) {
				this.matchDialogHeaderName = null;
				this.matchDialogMultiplayerData = null;
				this.matchDialogSendFinalResult = false;
			}
			else {
				this.matchDialogHeaderName = null;
				this.matchDialogMultiplayerData = null;

				if (this.ircService.hasWon$.value != null && this.matchDialogSendFinalResult == false) {
					this.matchDialogHeaderName = 'Match has finished';
					this.matchDialogSendFinalResult = true;
				}
				else {
					this.matchDialogSendFinalResult = false;
				}
			}
		}
		else {
			this.matchDialogHeaderName = null;
			this.matchDialogMultiplayerData = null;
			this.matchDialogSendFinalResult = false;
		}

		this.ref.detectChanges();
	}

	/**
	 * Send the result of the beatmap to irc if connected
	 * NOTE: Update in lobby-view.component.ts and send-beatmap-result.component.ts as well
	 *
	 * @param lastPlayedBeatmap
	 */
	sendBeatmapResult(lastPlayedBeatmap: MultiplayerData) {
		// User is connected to irc channel
		if (this.selectedChannel.name != null) {
			for (const triggerMessage of this.selectedLobby.tournament.triggerMessages) {
				const finalMessage = WyTriggerMessage.translateMessage(triggerMessage.message, lastPlayedBeatmap, this.selectedLobby, this.cacheService.getBeatmapname(lastPlayedBeatmap.beatmap_id));

				if (triggerMessage.beatmapResult) {
					if (triggerMessage.nextPickMessage) {
						if (this.selectedLobby.teamHasWon() == null && !this.selectedLobby.getTiebreaker()) {
							this.ircService.sendMessage(this.selectedChannel.name, finalMessage);
						}
					}
					else if (triggerMessage.nextPickTiebreakerMessage) {
						if (this.selectedLobby.teamHasWon() == null && this.selectedLobby.getTiebreaker()) {
							this.ircService.sendMessage(this.selectedChannel.name, finalMessage);
						}
					}
					else if (triggerMessage.matchWonMessage) {
						if (this.selectedLobby.teamHasWon() != null) {
							this.ircService.sendMessage(this.selectedChannel.name, finalMessage);
						}
					}
					else {
						this.ircService.sendMessage(this.selectedChannel.name, finalMessage);
					}
				}
			}

			this.closeMatchDialog();
		}
	}

	/**
	 * Focus the chat
	 *
	 * @param focus whether to focus
	 */
	focusChat(focus: boolean): void {
		if (focus == true) {
			this.ircChatControlsComponent.focusMessageInput();
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
	 * Opens a dm channel with the given player
	 *
	 * @param player the player to open the dm channel for
	 */
	openDMChannel(player: WyTeamPlayer): void {
		this.ircService.joinChannel(player.name);
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

		dialogRef.afterClosed().subscribe((result: { firstPick: string, firstBan: string, bestOf: number }) => {
			if (result != null) {
				this.selectedLobby.firstPick = result.firstPick ?? null;
				this.selectedLobby.firstBan = result.firstBan ?? null;
				this.selectedLobby.bestOf = result.bestOf ?? null;

				this.multiplayerLobbies.updateMultiplayerLobby(this.selectedLobby);
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
				if (this.selectedLobby.getTeamOneScore() != this.selectedLobby.getWinningConditionScore()) {
					this.selectedLobby.teamOneOverwriteScore++;
				}
			}
			else if (team == 2) {
				if (this.selectedLobby.getTeamTwoScore() != this.selectedLobby.getWinningConditionScore()) {
					this.selectedLobby.teamTwoOverwriteScore++;
				}
			}
		}
		else if (mouseClick == 'right') {
			if (team == 1) {
				if (this.selectedLobby.getTeamOneScore() > 0) {
					this.selectedLobby.teamOneOverwriteScore--;
				}
			}
			else if (team == 2) {
				if (this.selectedLobby.getTeamTwoScore() > 0) {
					this.selectedLobby.teamTwoOverwriteScore--;
				}
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

		this.tournamentService.getWyBinQualifierLobbyTeams(this.selectedLobby.tournament.wyBinTournamentId, this.selectedLobby.wybinMatchId).subscribe({
			next: (qualifierHelper: any) => {
				if (qualifierHelper.teamMembers != null) {
					for (const player in qualifierHelper.teamMembers) {
						const iPlayer = qualifierHelper.teamMembers[player];

						const newTeam = new WyTeam({
							name: iPlayer.user.username
						});

						newTeam.players.push(new WyTeamPlayer({
							name: iPlayer.user.username,
							userId: iPlayer.user.userOsu.id
						}));

						this.qualifierTeams.push(newTeam);
					}
				}
				else if (qualifierHelper.teams != null) {
					for (const team in qualifierHelper.teams) {
						const iTeam = qualifierHelper.teams[team];

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
				}
			},
			error: (error: HttpErrorResponse) => {
				this.toastService.addToast(error.error.message);
			}
		});
	}

	resizeSidebar(side: string, width: number) {
		if (side == 'left') {
			this.sidebarLeftWidth = width;
		}
		else if (side == 'right') {
			this.sidebarRightWidth = width;
		}
	}

	saveResizeSidebar(side: 'left' | 'right', width: number) {
		if (side == 'left') {
			this.sidebarLeftWidth = width;
		}
		else if (side == 'right') {
			this.sidebarRightWidth = width;
		}

		this.genericService.setIrcSidebarWidth(side, width);
	}

	getTemplate(view: IrcLayoutSectionViewType): TemplateRef<unknown> {
		switch (view) {
			case 'irc-channels':
				return this.ircChannelsTemplate;

			case 'player-management':
				return this.playerManagementTemplate;

			case 'match-settings':
				return this.matchSettingsTemplate;

			case 'general-interactions':
				return this.matchSettingsGeneralInteractionsTemplate;

			case 'multiplayer-lobby-settings':
				return this.matchSettingsMultiplayerLobbySettingsTemplate;

			case 'player-invites':
				return this.matchSettingsPlayersInvitationTemplate;

			case 'mappool':
				return this.mappoolTemplate;
		}
	}

	openLayoutEditor() {
		this.layoutEditorOpen = !this.layoutEditorOpen;
	}

	resizeIrcSection(sidebarItem: IrcLayoutSection, size: number, save: boolean) {
		sidebarItem.size = size;

		if (save) {
			this.ircLayoutService.save(sidebarItem);
		}
	}
}

