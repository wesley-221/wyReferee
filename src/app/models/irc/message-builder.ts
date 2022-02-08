import { WyMod } from "../wytournament/mappool/wy-mod";

export enum MessageType {
	Message = 'Message',
	Link = 'Link',
	ModAcronymPick = 'ModAcronymPick'
}

export class MessageBuilder {
	messageType: MessageType;
	message: string;
	linkName: string;
	modAcronymBeatmapId: number;
	modAcronymGameMode: number;
	modAcronymMappoolId: number;
	modAcronymModBracketId: number;
	modAcronymMods: WyMod[];

	constructor(init?: Partial<MessageBuilder>) {
		this.modAcronymMods = [];

		Object.assign(this, init);
	}

	public static makeTrueCopy(messageBuilder: MessageBuilder): MessageBuilder {
		const message = new MessageBuilder({
			messageType: messageBuilder.messageType,
			message: messageBuilder.message,
			linkName: messageBuilder.linkName,
			modAcronymBeatmapId: messageBuilder.modAcronymBeatmapId,
			modAcronymMappoolId: messageBuilder.modAcronymMappoolId,
			modAcronymModBracketId: messageBuilder.modAcronymModBracketId,
			modAcronymGameMode: messageBuilder.modAcronymGameMode
		});

		for (const mod in messageBuilder.modAcronymMods) {
			message.modAcronymMods.push(WyMod.makeTrueCopy(messageBuilder.modAcronymMods[mod]));
		}

		return message;
	}
}
