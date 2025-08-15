import { IrcMessage } from "./irc-message";

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
	label: string;
	active: boolean;
	messages: IrcMessage[];
	banchoBotMessages: IrcMessage[];
	plainMessageHistory: string[];

	lastActiveChannel: boolean;
	isPrivateChannel: boolean;
	isPublicChannel: boolean;
	hasUnreadMessages: boolean;
	playSoundOnMessage: boolean;

	teamMode: TeamMode | number;
	winCondition: WinCondition | number;
	players: number;

	editingLabel: boolean;
	oldLabel: string;
}
