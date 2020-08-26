export enum MessageType {
	Message = 'Message',
	Link = 'Link'
}

export class MessageBuilder {
	messageType: MessageType;
	message: string;
	linkName: string;

	constructor(messageType: MessageType, message: string, linkName: string = null) {
		this.messageType = messageType;
		this.message = message;
		this.linkName = linkName;
	}

	convertToJson(): { messageType: MessageType, message: string, linkName: string } {
		return {
			messageType: this.messageType,
			message: this.message,
			linkName: this.linkName
		}
	}
}
