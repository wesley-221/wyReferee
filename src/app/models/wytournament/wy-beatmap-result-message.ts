export class WyBeatmapResultMessage {
	id: number;
	index: number;
	message: string;
	nextPickMessage: boolean;
	nextPickTiebreakerMessage: boolean;
	matchWonMessage: boolean;

	constructor(init?: Partial<WyBeatmapResultMessage>) {
		this.nextPickMessage = false;
		this.nextPickTiebreakerMessage = false;
		this.matchWonMessage = false;

		Object.assign(this, init);
	}

	public static makeTrueCopy(beatmapResultMessage: WyBeatmapResultMessage): WyBeatmapResultMessage {
		return new WyBeatmapResultMessage({
			id: beatmapResultMessage.id,
			index: beatmapResultMessage.index,
			message: beatmapResultMessage.message,
			nextPickMessage: beatmapResultMessage.nextPickMessage,
			nextPickTiebreakerMessage: beatmapResultMessage.nextPickTiebreakerMessage,
			matchWonMessage: beatmapResultMessage.matchWonMessage
		});
	}
}
