import { MessageBuilder } from './message-builder';

export interface IrcMessage {
	messageId: number;
	date: string;
	time: string;
	author: string;
	messageBuilder: MessageBuilder[];
	isADivider: boolean;
}
