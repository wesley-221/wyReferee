export class CacheBeatmap {
	name: string;
	beatmapId: number;
	beatmapSetId: number
	beatmapUrl: string;

	constructor(init?: Partial<CacheBeatmap>) {
		Object.assign(this, init);
	}
}
