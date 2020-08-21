export class CacheBeatmap {
	name: string;
	beatmapId: number;
	beatmapSetId: number
	beatmapUrl: string;

	constructor(name: string, beatmapId: number, beatmapSetId: number, beatmapUrl: string) {
		this.name = name;
		this.beatmapId = beatmapId;
		this.beatmapSetId = beatmapSetId;
		this.beatmapUrl = beatmapUrl;
	}
}
