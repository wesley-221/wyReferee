import { WyMod } from "./wy-mod";

export enum MessageType {
	Message = 'Message',
	Link = 'Link',
	ModAcronymPick = 'ModAcronymPick'
}

export class MessageBuilder {
	messageType: MessageType | string;
	message: string;
	linkName: string;
	modAcronymBeatmapId: number;
	modAcronymGameMode: number;
	modAcronymMappoolId: number;
	modAcronymModBracketId: number;
	modAcronymMods: WyMod[];
}
