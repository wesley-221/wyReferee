import { MessageBuilder } from './message-builder';

export class IrcMessage {
	messageId: number;
	date: string;
	time: string;
	author: string;
	messageBuilder: MessageBuilder[];
	isADivider: boolean;

	constructor(init?: Partial<IrcMessage>) {
		this.messageBuilder = [];

		Object.assign(this, init);
	}

	public static makeTrueCopy(ircMessage: IrcMessage): IrcMessage {
		const newIrcMessage = new IrcMessage({
			messageId: ircMessage.messageId,
			date: ircMessage.date,
			time: ircMessage.time,
			author: ircMessage.author,
			isADivider: ircMessage.isADivider
		});

		for (const message in ircMessage.messageBuilder) {
			newIrcMessage.messageBuilder.push(MessageBuilder.makeTrueCopy(ircMessage.messageBuilder[message]));
		}

		return newIrcMessage;
	}
}
