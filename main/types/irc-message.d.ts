import { MessageBuilder } from './message-builder';

export declare class IrcMessage {
	messageId: number;
	date: string;
	time: string;
	author: string;
	messageBuilder: MessageBuilder[];
	isADivider: boolean;
}
