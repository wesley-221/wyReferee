import { IrcMessage } from './irc-message';

export enum TeamMode {
	HeadToHead = 0,
	TagCoop = 1,
	TeamVs = 2,
	TagTeamVs = 3
}

export enum WinCondition {
	Score = 0,
	Accuracy = 1,
	Combo = 2,
	ScoreV2 = 3
}

export class IrcChannel {
	name: string;
	active: boolean;
	messages: IrcMessage[];

	lastActiveChannel: boolean;
	isPrivateChannel: boolean;
	hasUnreadMessages: boolean;
	playSoundOnMessage: boolean;

	teamMode: TeamMode;
	winCondition: WinCondition;
	players: number;

	constructor(init?: Partial<IrcChannel>) {
		this.messages = [];

		Object.assign(this, init);
	}

	public static makeTrueCopy(ircChannel: IrcChannel): IrcChannel {
		const newIrcChannel = new IrcChannel({
			name: ircChannel.name,
			active: ircChannel.active,
			lastActiveChannel: ircChannel.lastActiveChannel,
			isPrivateChannel: ircChannel.isPrivateChannel,
			hasUnreadMessages: ircChannel.hasUnreadMessages,
			playSoundOnMessage: ircChannel.playSoundOnMessage,
			teamMode: ircChannel.teamMode,
			winCondition: ircChannel.winCondition,
			players: ircChannel.players
		});

		for (const message in ircChannel.messages) {
			newIrcChannel.messages.push(IrcMessage.makeTrueCopy(ircChannel.messages[message]));
		}

		return newIrcChannel;
	}
}
