import { Injectable } from '@angular/core';
import { BanchoClient, PrivateMessage, ChannelMessage, BanchoChannel, BanchoMultiplayerChannel, BanchoLobbyPlayer } from 'bancho.js';
import { ToastService } from './toast.service';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Regex } from '../models/irc/regex';
import { MessageBuilder, MessageType } from '../models/irc/message-builder';
import { Howl } from 'howler';
import { IrcChannel, TeamMode, WinCondition } from 'app/models/irc/irc-channel';
import { IrcMessage } from 'app/models/irc/irc-message';
import { WyMultiplayerLobbiesService } from './wy-multiplayer-lobbies.service';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { Lobby } from 'app/models/lobby';
import { MultiplayerLobbyPlayersService } from './multiplayer-lobby-players.service';
import { ElectronService } from './electron.service';
import { GenericService } from './generic.service';
import { IrcAuthenticationStoreService } from './storage/irc-authentication-store.service';

@Injectable({
	providedIn: 'root'
})

export class IrcService {
	client: BanchoClient;

	/**
	 * Whether or not the user is authenticated to irc
	 */
	isAuthenticated = false;

	/**
	 * The username of the authenticated user
	 */
	authenticatedUser = 'none';
	ircConnectionError: string;

	allChannels: IrcChannel[] = [];

	// Variables to tell if we are connecting/disconnecting to irc
	isConnecting$: BehaviorSubject<boolean>;
	isDisconnecting$: BehaviorSubject<boolean>;
	isJoiningChannel$: BehaviorSubject<boolean>;
	messageHasBeenSend$: BehaviorSubject<boolean>;

	setChannelUnreadMessages$: BehaviorSubject<IrcChannel>;

	// Indicates if the multiplayerlobby is being created for "Create a lobby" route
	isCreatingMultiplayerLobby = -1;

	private isAuthenticated$: BehaviorSubject<boolean>;

	// Indication if a sound is playing or not
	private soundIsPlaying = false;

	constructor(private toastService: ToastService,
		private multiplayerLobbiesService: WyMultiplayerLobbiesService,
		private multiplayerLobbyPlayersService: MultiplayerLobbyPlayersService,
		private electronService: ElectronService,
		private genericService: GenericService,
		private ircAuthenticationStore: IrcAuthenticationStoreService) {
		// Create observables for is(Dis)Connecting
		this.isConnecting$ = new BehaviorSubject<boolean>(false);
		this.isDisconnecting$ = new BehaviorSubject<boolean>(false);
		this.isJoiningChannel$ = new BehaviorSubject<boolean>(false);
		this.messageHasBeenSend$ = new BehaviorSubject<boolean>(false);
		this.isAuthenticated$ = new BehaviorSubject<boolean>(false);
		this.setChannelUnreadMessages$ = new BehaviorSubject<IrcChannel>(null);

		const initialConnect = ircAuthenticationStore
			.watchIrcStore()
			.subscribe(store => {
				if (store) {
					if (store.ircUsername && store.ircPassword) {
						this.connect(store.ircUsername, store.ircPassword, store.apiKey);
					}

					initialConnect.unsubscribe();
				}
			});

		window.electronApi.getAllIrcChannels().then(connectedChannels => {
			// Loop through all the channels
			for (const channel in connectedChannels) {
				const nChannel = IrcChannel.makeTrueCopy(connectedChannels[channel]);

				// Add a divider to the channel to show new messages
				nChannel.messages.push(new IrcMessage({
					messageId: null,
					date: 'n/a',
					time: 'n/a',
					author: 'Today',
					messageBuilder: [new MessageBuilder({
						messageType: MessageType.Message,
						message: 'Messages from history'
					})],
					isADivider: true
				}));

				this.allChannels.push(nChannel);
			}
		});
	}

	/**
	 * Check if we are connecting
	 */
	getIsConnecting(): Observable<boolean> {
		return this.isConnecting$.asObservable();
	}

	/**
	 * Check if we are disconnecting
	 */
	getIsDisconnecting(): Observable<boolean> {
		return this.isDisconnecting$.asObservable();
	}

	/**
	 * Check if we are joining a channel
	 */
	getIsJoiningChannel(): Observable<boolean> {
		return this.isJoiningChannel$.asObservable();
	}

	/**
	 * Check if there was a message send
	 */
	hasMessageBeenSend(): Observable<boolean> {
		return this.messageHasBeenSend$.asObservable();
	}

	/**
	 * Check if the user is authenticated
	 */
	getIsAuthenticated(): Observable<boolean> {
		return this.isAuthenticated$.asObservable();
	}

	/**
	 * Connect the user to irc
	 *
	 * @param username the username to connect with
	 * @param password the password to connect with
	 */
	connect(username: string, password: string, apiKey: string) {
		this.client = new BanchoClient({ username: username, password: password, apiKey: apiKey });

		this.isConnecting$.next(true);

		/**
		 * Message handler
		 */
		this.client.on('PM', (message: PrivateMessage) => {
			if (message.self != true) {
				this.addMessageToChannel(message.user.ircUsername, message.recipient.ircUsername, message.content, false);
			}
		});

		this.client.on('CM', (message: ChannelMessage) => {
			// Make sure message is send in a multiplayer channel as well as by BanchoBot
			if (message.channel.name.startsWith('#mp_') && message.user.ircUsername == 'BanchoBot') {
				const multiplayerInitialization = Regex.multiplayerInitialization.run(message.message);
				const multiplayerSettingsChange = Regex.multiplayerSettingsChange.run(message.message);
				const matchClosed = Regex.closedMatch.run(message.message);
				const playerInSlot = Regex.playerInSlot.run(message.message);

				// Initialize the channel with the correct teammode and wincondition
				if (multiplayerInitialization) {
					this.getChannelByName(message.channel.name).teamMode = TeamMode[multiplayerInitialization.teamMode];
					this.getChannelByName(message.channel.name).winCondition = WinCondition[multiplayerInitialization.winCondition];
				}

				// The room was changed by "!mp set x x x"
				if (multiplayerSettingsChange) {
					this.getChannelByName(message.channel.name).players = multiplayerSettingsChange.size;
					this.getChannelByName(message.channel.name).teamMode = TeamMode[multiplayerSettingsChange.teamMode];
					this.getChannelByName(message.channel.name).winCondition = WinCondition[multiplayerSettingsChange.winCondition];
				}

				// The match was closed
				if (matchClosed) {
					this.changeActiveChannel(this.getChannelByName(message.channel.name), false);
					this.getChannelByName(message.channel.name).active = false;
				}

				// Gets called when !mp settings is ran
				if (playerInSlot) {
					const multiplayerLobby = this.multiplayerLobbiesService.getMultiplayerLobbyByIrc(message.channel.name);

					this.multiplayerLobbyPlayersService.lobbyChange(multiplayerLobby.lobbyId, 'playerInSlot', playerInSlot);

					// Check if the player is in the correct slot
					// TODO: Fix the isInCorrectSlot check, doesn't always work
					// if (multiplayerLobby) {
					// 	if (multiplayerLobby.isQualifierLobby != true) {
					// 		if (!this.multiplayerLobbyPlayersService.isInCorrectSlot(playerInSlot.username, multiplayerLobby)) {
					// 			message.message += ` | Incorrect slot, player should be in slot ${multiplayerLobby.getCorrectSlot(playerInSlot.username)}`;
					// 		}
					// 	}
					// }
				}
			}

			if (message.channel.name.startsWith('#mp_') && message.user.ircUsername != 'BanchoBot' && message.message.startsWith('!')) {
				this.handleIrcCommand(message);
			}

			this.sendChannelMessage(message);
		});

		this.client.on('nochannel', (channel: BanchoChannel) => {
			if (this.getChannelByName(channel.name) != null) {
				this.getChannelByName(channel.name).active = false;
				this.changeActiveChannel(this.getChannelByName(channel.name), false);
			}
		});

		from(this.client.connect()).subscribe({
			next: () => {
				this.isAuthenticated = true;
				this.authenticatedUser = username;

				// Save the credentials
				this.ircAuthenticationStore.set('ircUsername', username);
				this.ircAuthenticationStore.set('ircPassword', password);

				this.isConnecting$.next(false);
				this.ircConnectionError = null;

				this.isAuthenticated$.next(true);

				// Initialize multiplayer channels after restart
				window.electronApi.getAllIrcChannels().then((allJoinedChannels) => {
					for (const ircChannel in allJoinedChannels) {
						if (allJoinedChannels[ircChannel].isPrivateChannel == false && allJoinedChannels[ircChannel].isPublicChannel == false) {
							const channel = this.client.getChannel(allJoinedChannels[ircChannel].name) as BanchoMultiplayerChannel;

							from(channel.join()).subscribe(() => {
								this.initializeChannelListeners(channel);
							});
						}
					}
				});
			},
			error: (error) => {
				this.isConnecting$.next(false);
				this.ircConnectionError = error;
			}
		});
	}

	/**
	 * Initialize the channel listeners when connecting to a channel
	 *
	 * @param channel
	 */
	initializeChannelListeners(channel: BanchoMultiplayerChannel, lobby?: Lobby) {
		if (lobby == undefined) {
			lobby = this.multiplayerLobbiesService.getMultiplayerLobbyByIrc(channel.name);
		}

		channel.lobby.on('matchFinished', () => {
			this.multiplayerLobbiesService.synchronizeMultiplayerMatch(lobby, true, true);
		});

		channel.lobby.on('size', (size: number) => {
			this.getChannelByName(channel.name).players = size;
		});

		channel.lobby.on('playerJoined', (obj: { player: BanchoLobbyPlayer; slot: number; team: string }) => {
			// Slot starts at 0 instead of 1

			this.multiplayerLobbyPlayersService.lobbyChange(lobby.lobbyId, 'playerJoined', obj);
		});

		channel.lobby.on('playerLeft', (player: BanchoLobbyPlayer) => {
			this.multiplayerLobbyPlayersService.lobbyChange(lobby.lobbyId, 'playerLeft', player);
		});

		channel.lobby.on('playerMoved', (obj: { player: BanchoLobbyPlayer; slot: number }) => {
			// Slot starts at 0 instead of 1
			this.multiplayerLobbyPlayersService.lobbyChange(lobby.lobbyId, 'playerMoved', obj);
		});

		channel.lobby.on('host', (player: BanchoLobbyPlayer) => {
			this.multiplayerLobbyPlayersService.lobbyChange(lobby.lobbyId, 'host', player);
		});

		channel.lobby.on('hostCleared', () => {
			this.multiplayerLobbyPlayersService.lobbyChange(lobby.lobbyId, 'hostCleared', null);
		});

		channel.lobby.on('playerChangedTeam', (obj: { player: BanchoLobbyPlayer; team: string }) => {
			this.multiplayerLobbyPlayersService.lobbyChange(lobby.lobbyId, 'playerChangedTeam', obj);
		});
	}

	/**
	 * Disconnect the user from irc
	 */
	disconnect() {
		if (this.isAuthenticated) {
			this.client.removeAllListeners();

			this.isDisconnecting$.next(true);

			this.client.disconnect();

			this.isAuthenticated = false;
			this.authenticatedUser = 'none';

			// Delete the credentials
			this.ircAuthenticationStore.remove(['ircUsername', 'ircPassword']);

			this.isDisconnecting$.next(false);

			this.toastService.addToast('Successfully disconnected from irc.');
		}
	}

	/**
	 * Get the channel by its name
	 *
	 * @param channelName the channelname
	 */
	getChannelByName(channelName: string) {
		let channel: IrcChannel = null;
		for (const i in this.allChannels) {
			if (this.allChannels[i].name == channelName) {
				channel = this.allChannels[i];
				break;
			}
		}

		return channel;
	}

	/**
	 * Add a message to the appropriate channel
	 *
	 * @param user the user that is sending the message
	 * @param recipient the user that is receiving the message
	 * @param message the message it self
	 * @param isSending if the message is being send or being received
	 */
	addMessageToChannel(user: string, recipient: string, message: string, isSending: boolean) {
		const date = new Date();
		const timeFormat = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
		const dateFormat = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

		let newMessage: IrcMessage;

		// ===============================
		// The user is sending the message
		if (isSending == true) {
			let channel = this.getChannelByName(recipient);
			const multiplayerLobby = this.multiplayerLobbiesService.getMultiplayerLobbyByIrc(channel.name);

			// Join channel if you haven't joined it yet
			if (channel == null) {
				this.joinChannel(recipient);
				channel = this.getChannelByName(recipient);
			}

			newMessage = new IrcMessage({
				messageId: Object.keys(channel.messages).length + 1,
				date: dateFormat,
				time: timeFormat,
				author: user,
				messageBuilder: this.buildMessage(message, multiplayerLobby),
				isADivider: false
			});

			channel.messages.push(newMessage);
			channel.plainMessageHistory.push(message);
			this.setChannelUnreadMessages$.next(channel);

			this.saveOutgoingMessageToHistory(recipient, newMessage, message);
		}
		// =============================
		// The message is being received
		else {
			let channel = this.getChannelByName(user);
			const messageId = channel == null ? 0 : Object.keys(channel.messages).length + 1;

			// Join channel if you haven't joined it yet
			if (channel == null) {
				this.joinChannel(user);
				channel = this.getChannelByName(user);
			}

			const multiplayerLobby = this.multiplayerLobbiesService.getMultiplayerLobbyByIrc(channel.name);

			// Message is received from a #mp_ channel
			if (user.startsWith('#mp_')) {
				newMessage = new IrcMessage({
					messageId: messageId,
					date: dateFormat,
					time: timeFormat,
					author: recipient,
					messageBuilder: this.buildMessage(message, multiplayerLobby),
					isADivider: false
				});
			}
			// Message is received from a # channel, such as #osu/#taiko/#ctb/#mania/etc
			else if (user.startsWith('#')) {
				newMessage = new IrcMessage({
					messageId: messageId,
					date: dateFormat,
					time: timeFormat,
					author: recipient,
					messageBuilder: this.buildMessage(message, multiplayerLobby),
					isADivider: false
				});
			}
			// Message received as a DM
			else {
				newMessage = new IrcMessage({
					messageId: messageId,
					date: dateFormat,
					time: timeFormat,
					author: user,
					messageBuilder: this.buildMessage(message, multiplayerLobby),
					isADivider: false
				});
			}

			if (user.startsWith('#mp_')) {
				if (this.genericService.getSplitBanchoMessages().value == true) {
					if (recipient == 'BanchoBot') {
						channel.banchoBotMessages.push(newMessage);
						this.saveMessageToHistory(user, newMessage, message, true);
					}
					else {
						channel.messages.push(newMessage);
						this.saveMessageToHistory(user, newMessage, message);
					}
				}
				else {
					channel.messages.push(newMessage);
					this.saveMessageToHistory(user, newMessage, message);
				}
			}
			else {
				channel.messages.push(newMessage);
				this.saveMessageToHistory(user, newMessage, message);
			}

			this.setChannelUnreadMessages$.next(channel);

			if (channel.playSoundOnMessage) {
				const sound = new Howl({
					src: ['assets/stairs.mp3'],
				});

				if (!this.soundIsPlaying) {
					sound.play();
					this.soundIsPlaying = true;
				}

				sound.on('end', () => {
					this.soundIsPlaying = false;
				});
			}

			// Flash window when a message has been sent and window is not focused
			window.electronApi.flashWindow();
		}

		this.messageHasBeenSend$.next(true);
	}

	/**
	 * Join a channel
	 *
	 * @param channelName
	 */
	joinChannel(channelName: string, customLabel: string = null) {
		this.isJoiningChannel$.next(true);

		// Check if you have already joined the channel
		for (const channel of this.allChannels) {
			if (channel.name == channelName) {
				this.toastService.addToast(`You have already joined the channel "${channelName}".`);
				this.isJoiningChannel$.next(false);
				return;
			}
		}

		// ===================================
		// Joining a multiplayer match channel
		if (channelName.startsWith('#mp_')) {
			const newChannel = new IrcChannel({
				name: channelName,
				label: customLabel == null ? null : customLabel,
				active: true,
				lastActiveChannel: false,
				isPrivateChannel: false,
				isPublicChannel: false,
				playSoundOnMessage: false
			});

			window.electronApi.createIrcChannel(channelName, newChannel);
			this.allChannels.push(newChannel);

			this.toastService.addToast(`Joined channel "${channelName}".`);

			const channel = this.client.getChannel(channelName) as BanchoMultiplayerChannel;
			channel.join();

			this.isJoiningChannel$.next(false);
		}
		// =========================================================
		// Joining a "default" channel, such as #osu/#ctb/#dutch/etc
		else if (channelName.startsWith('#')) {
			const newChannel = new IrcChannel({
				name: channelName,
				active: true,
				lastActiveChannel: false,
				isPrivateChannel: false,
				isPublicChannel: true,
				playSoundOnMessage: false
			});

			window.electronApi.createIrcChannel(channelName, newChannel);
			this.allChannels.push(newChannel);

			const channel = this.client.getChannel(channelName) as BanchoMultiplayerChannel;
			channel.join();

			this.toastService.addToast(`Joined channel "${channelName}".`);

			this.isJoiningChannel$.next(false);
		}
		// =======================================
		// Joining a non multiplayer match channel
		else {
			const getChannel = this.getChannelByName(channelName);

			if (getChannel == null) {
				const newChannel = new IrcChannel({
					name: channelName,
					active: true,
					lastActiveChannel: false,
					isPrivateChannel: true,
					isPublicChannel: false,
					playSoundOnMessage: false
				});

				window.electronApi.createIrcChannel(channelName, newChannel);
				this.allChannels.push(newChannel);

				this.toastService.addToast(`Opened private message channel with "${channelName}".`);
			}

			this.isJoiningChannel$.next(false);
		}
	}

	/**
	 * Send a message to the given channelmessage
	 *
	 * @param message
	 */
	sendChannelMessage(message: ChannelMessage) {
		// Message is send from ingame
		if (message.self == false) {
			this.addMessageToChannel(message.channel.name, message.user.ircUsername, message.message, false);
		}
	}

	/**
	 * Part from the given channel
	 *
	 * @param channelName the channel to part
	 */
	partChannel(channelName: string) {
		for (const channel of this.allChannels) {
			if (channel.name == channelName) {
				this.allChannels.splice(this.allChannels.indexOf(channel), 1);

				if (channel.name.startsWith('#')) {
					this.client.getChannel(channelName).leave();
				}

				window.electronApi.deleteIrcChannel(channelName);
				this.toastService.addToast(`Successfully parted "${channelName}".`);

				break;
			}
		}
	}

	/**
	 * Send a message to the said channel
	 *
	 * @param channelName the channel to send the message in
	 * @param message the message to send
	 */
	sendMessage(channelName: string, message: string) {
		this.addMessageToChannel(this.authenticatedUser, channelName, message, true);

		if (channelName.startsWith('#')) {
			this.client.getChannel(channelName).sendMessage(message);
		}
		else {
			this.client.getUser(channelName).sendMessage(message);
		}
	}

	/**
	 * Save the rearranged channels
	 *
	 * @param channels the rearranged channels
	 */
	rearrangeChannels(channels: IrcChannel[]) {
		const rearrangedChannels = {};

		for (const i in channels) {
			rearrangedChannels[channels[i].name] = new IrcChannel({
				name: channels[i].name,
				active: channels[i].active,
				messages: channels[i].messages.filter(m => !m.isADivider),
				lastActiveChannel: channels[i].lastActiveChannel,
				isPrivateChannel: channels[i].isPrivateChannel
			});
		}

		// window.electronApi.setAllIrcChannels(rearrangedChannels);
	}

	/**
	 * Change the last active status in the store for the given channel
	 *
	 * @param channel the channel to change the status of
	 * @param active the status
	 */
	changeLastActiveChannel(channel: IrcChannel, active: boolean) {
		window.electronApi.changeLastActiveChannel(channel.name, active);
	}

	/**
	 * Change the active status in the store for the given channel
	 *
	 * @param channel the channel to change the status of
	 * @param active the status
	 */
	changeActiveChannel(channel: IrcChannel, active: boolean) {
		window.electronApi.changeActiveChannel(channel.name, active);
	}

	/**
	 * Save the outgoing message in the channel history
	 *
	 * @param channelName the channel to save the message in
	 * @param message the message object to save
	 * @param plainMessage the plain message that was sent
	 */
	saveOutgoingMessageToHistory(channelName: string, message: IrcMessage, plainMessage: string) {
		if (message.isADivider) {
			return;
		}

		window.electronApi.addOutgoingIrcMessage(channelName, message, plainMessage);
	}

	/**
	 * Save the message in the channel history
	 *
	 * @param channelName the channel to save it in
	 * @param message the message object to save
	 * @param plainMessage the plain message that was sent
	 * @param saveInBanchoMessages whether to save the message as a BanchoBot message
	 */
	saveMessageToHistory(channelName: string, message: IrcMessage, plainMessage: string, saveInBanchoMessages?: boolean) {
		if (message.isADivider) {
			return;
		}

		window.electronApi.addIrcMessage(channelName, message, plainMessage, saveInBanchoMessages);
	}

	/**
	 * Build a message with the appropriate hyperlinks
	 *
	 * @param message the message to build
	 * @param lobby the multiplayer lobby the message was sent for
	 */
	buildMessage(message: string, lobby: Lobby): MessageBuilder[] {
		const messageBuilder: MessageBuilder[] = [];

		const allRegexes = [
			Regex.isListeningTo,
			Regex.isWatching,
			Regex.isPlaying,
			Regex.isEditing,
			Regex.playerBeatmapChange
		];

		let regexSucceeded = false;

		// Handle all the regexes
		for (const regex in allRegexes) {
			const currentRegex = allRegexes[regex].run(message);

			if (currentRegex != null) {
				messageBuilder.push(new MessageBuilder({
					messageType: MessageType.Message,
					message: currentRegex.message
				}));

				messageBuilder.push(new MessageBuilder({
					messageType: MessageType.Link,
					message: currentRegex.link,
					linkName: currentRegex.name
				}));

				regexSucceeded = true;
			}
		}

		// Handle messages that do not match any of the regexes
		if (!regexSucceeded) {
			const isLinkRegex = Regex.isLink.run(message);
			const isEmbedRegex = Regex.isEmbedLink.run(message);

			// Embed link
			if (isEmbedRegex != null) {
				const splittedString = message.split(Regex.isEmbedLink.regexFullEmbed).filter(s => s != '' && s.trim());

				if (splittedString.length == 1) {
					const linkSplit = splittedString[0].split(Regex.isEmbedLink.regexSplit).filter(s => s != '' && s.trim());

					messageBuilder.push(new MessageBuilder({
						messageType: MessageType.Link,
						message: linkSplit[0],
						linkName: linkSplit[1]
					}));
				}
				else {
					for (const split in splittedString) {
						// The split is a link
						if (Regex.isEmbedLink.run(splittedString[split])) {
							const linkSplit = splittedString[split].split(Regex.isEmbedLink.regexSplit).filter(s => s != '' && s.trim());

							messageBuilder.push(new MessageBuilder({
								messageType: MessageType.Link,
								message: linkSplit[0],
								linkName: linkSplit[1]
							}));
						}
						// The split is a message
						else {
							messageBuilder.push(new MessageBuilder({
								messageType: MessageType.Message,
								message: splittedString[split]
							}));
						}
					}
				}
			}
			// Check if there is a link
			else if (isLinkRegex != null) {
				const splittedString = message.split(Regex.isLink.regex).filter(s => s != '' && s.trim());

				if (splittedString.length == 1) {
					messageBuilder.push(new MessageBuilder({
						messageType: MessageType.Link,
						message: splittedString[0]
					}));
				}
				else {
					for (const split in splittedString) {
						// The split is a link
						if (Regex.isLink.run(splittedString[split])) {
							messageBuilder.push(new MessageBuilder({
								messageType: MessageType.Link,
								message: splittedString[split]
							}));
						}
						// The split is a message
						else {
							messageBuilder.push(new MessageBuilder({
								messageType: MessageType.Message,
								message: splittedString[split]
							}));
						}
					}
				}
			}
			else {
				// Multiplayer lobby regex -> HD1/DT3/etc.
				if (lobby != undefined && lobby != null && lobby.mappool != null && lobby.mappool != undefined) {
					let regexp = lobby.mappool.getModbracketRegex(true);
					const currentRegexTest = Regex.multiplayerLobbyMod.test(regexp, message);

					// A mod acronym was mentioned
					if (currentRegexTest) {
						const splittedString = message.split(regexp).filter(s => s != undefined && s != '' && s.trim());

						if (splittedString.length == 1) {
							const mapInformation = lobby.mappool.getInformationFromPickAcronym(splittedString[0]);

							messageBuilder.push(new MessageBuilder({
								messageType: MessageType.ModAcronymPick,
								message: splittedString[0],
								modAcronymBeatmapId: mapInformation.beatmapId,
								modAcronymGameMode: lobby.tournament.gamemodeId,
								modAcronymMappoolId: lobby.mappool.id,
								modAcronymModBracketId: mapInformation.modBracket.id,
								modAcronymMods: mapInformation.modBracket.mods
							}));
						}
						else {
							regexp = lobby.mappool.getModbracketRegex();

							for (const split in splittedString) {
								// The split is a mod acronym pick
								if (regexp.test(splittedString[split])) {
									const mapInformation = lobby.mappool.getInformationFromPickAcronym(splittedString[split]);

									messageBuilder.push(new MessageBuilder({
										messageType: MessageType.ModAcronymPick,
										message: splittedString[split],
										modAcronymBeatmapId: mapInformation.beatmapId,
										modAcronymGameMode: lobby.tournament.gamemodeId,
										modAcronymMappoolId: lobby.mappool.id,
										modAcronymModBracketId: mapInformation.modBracket.id,
										modAcronymMods: mapInformation.modBracket.mods
									}));
								}
								// The split is a message
								else {
									messageBuilder.push(new MessageBuilder({
										messageType: MessageType.Message,
										message: splittedString[split]
									}));
								}
							}
						}
					}
					// Normal message
					else {
						messageBuilder.push(new MessageBuilder({
							messageType: MessageType.Message,
							message: message
						}));
					}
				}
				// Normal message
				else {
					messageBuilder.push(new MessageBuilder({
						messageType: MessageType.Message,
						message: message
					}));
				}
			}
		}

		return messageBuilder;
	}

	/**
	 * Handle irc commands
	 *
	 * @param message the message to process
	 */
	handleIrcCommand(message: ChannelMessage) {
		const commandSplit = message.message.substr(1, message.message.length).split(' ');
		const command = commandSplit.shift().toLowerCase();
		const commandMessage = commandSplit.join(' ');

		// !pick was run by someone
		if (command == 'pick') {
			const multiplayerLobby = this.multiplayerLobbiesService.getMultiplayerLobbyByIrc(message.channel.name);
			let captainFound = false;

			// Check if the command was ran by one of the captains
			if (multiplayerLobby.getNextPick() == multiplayerLobby.teamOneName) {
				for (const user of multiplayerLobby.getTeamPlayersFromTournament(multiplayerLobby.teamOneName)) {
					if (user.name == multiplayerLobby.teamOneCaptain.name) {
						captainFound = true;
						break;
					}
				}
			}
			else {
				for (const user of multiplayerLobby.getTeamPlayersFromTournament(multiplayerLobby.teamTwoName)) {
					if (user.name == multiplayerLobby.teamTwoCaptain.name) {
						captainFound = true;
						break;
					}
				}
			}

			// Command was not ran by the captain that is supposed to pick
			if (captainFound == false) {
				return;
			}

			// Look for the mod bracket
			let foundModBracket: WyModBracket = null;
			const modBracketString: string[] = [];

			for (const modBracket of multiplayerLobby.mappool.modBrackets) {
				// Ignore tiebreaker from being randomly picked
				if (modBracket.name.toLowerCase() == 'tiebreaker') {
					continue;
				}

				if (modBracket.name == commandMessage || modBracket.acronym == commandMessage) {
					foundModBracket = modBracket;
				}

				modBracketString.push(`${modBracket.name} (${modBracket.acronym})`);
			}

			// Mod bracket was not found
			if (foundModBracket == null) {
				this.sendMessage(message.channel.name, `Could not find modbracket "${commandMessage}". Available modbrackets are: ${modBracketString.join(', ')}.`);
				return;
			}

			// Pick the random map
			const randomMap = foundModBracket.pickRandomMap(multiplayerLobby);

			if (randomMap == null) {
				this.sendMessage(message.channel.name, `${foundModBracket.name} has ran out of maps to pick from.`);
				return;
			}
			else {
				// TODO: pick the map
				// pick the map
			}
		}
	}

	/**
	 * Whenever a message gets sent
	 */
	getChannelMessageUnread(): BehaviorSubject<IrcChannel> {
		return this.setChannelUnreadMessages$;
	}
}
