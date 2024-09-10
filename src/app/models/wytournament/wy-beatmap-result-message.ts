export class WyBeatmapResultMessage {
	id: number;
	index: number;
	message: string;
	beatmapResult: boolean;
	beatmapPicked: boolean;
	nextPickMessage: boolean;
	nextPickTiebreakerMessage: boolean;
	matchWonMessage: boolean;

	constructor(init?: Partial<WyBeatmapResultMessage>) {
		this.beatmapResult = false;
		this.beatmapPicked = false;
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
			beatmapResult: beatmapResultMessage.beatmapResult,
			beatmapPicked: beatmapResultMessage.beatmapPicked,
			nextPickMessage: beatmapResultMessage.nextPickMessage,
			nextPickTiebreakerMessage: beatmapResultMessage.nextPickTiebreakerMessage,
			matchWonMessage: beatmapResultMessage.matchWonMessage
		});
	}
}
