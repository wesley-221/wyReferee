import { MessageBuilder } from './message-builder';

export class Message {
	messageId: number;
	date: string;
	time: string;
	author: string;
	message: MessageBuilder[];
	isADivider: boolean;

	constructor(messageId: number, date: string, time: string, author: string, message: MessageBuilder[], isADivider = false) {
		this.messageId = messageId;
		this.date = date;
		this.time = time;
		this.author = author;
		this.message = message;
		this.isADivider = isADivider;
	}

	convertToJson(): { messageId: number, date: string, time: string, author: string, message: any[] } {
		return {
			messageId: this.messageId,
			date: this.date,
			time: this.time,
			author: this.author,
			message: this.message.map(m => m.convertToJson())
		};
	}
}
