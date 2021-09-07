export enum MessageType {
	Message = 'Message',
	Link = 'Link'
}

export class MessageBuilder {
	messageType: MessageType;
	message: string;
	linkName: string;

	constructor(init?: Partial<MessageBuilder>) {
		Object.assign(this, init);
	}

	public static makeTrueCopy(messageBuilder: MessageBuilder): MessageBuilder {
		return new MessageBuilder({
			messageType: messageBuilder.messageType,
			message: messageBuilder.message,
			linkName: messageBuilder.linkName
		});
	}
}
