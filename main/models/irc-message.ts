import { MessageBuilder } from './message-builder';

export class IrcMessage {
	messageId: number;
	date: string;
	time: string;
	author: string;
	messageBuilder: MessageBuilder[];
	isADivider: boolean;
}
