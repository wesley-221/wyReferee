export class WyBeatmapResultMessage {
	id: number;
	index: number;
	message: string;

	constructor(init?: Partial<WyBeatmapResultMessage>) {
		Object.assign(this, init);
	}

	public static makeTrueCopy(beatmapResultMessage: WyBeatmapResultMessage): WyBeatmapResultMessage {
		return new WyBeatmapResultMessage({
			id: beatmapResultMessage.id,
			index: beatmapResultMessage.index,
			message: beatmapResultMessage.message
		});
	}
}
