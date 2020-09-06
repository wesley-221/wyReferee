import { Message } from './message';

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

export class Channel {
	channelName: string;
	active = true;
	allMessages: Message[];
	lastActiveChannel = false;
	isPrivateChannel = false;
	hasUnreadMessages = false;
	playSoundOnMessage = false;

	teamMode: TeamMode;
	winCondition: WinCondition;
	players: number;

	constructor(channelName: string, isPrivateChannel = false) {
		this.channelName = channelName;
		this.isPrivateChannel = isPrivateChannel;
		this.playSoundOnMessage = false;
		this.allMessages = [];
	}
}
