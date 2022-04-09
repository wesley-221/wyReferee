export class CacheModifier {
	beatmap_name: string;
	beatmap_id: number;
	modifier: number;

	constructor(beatmap_name: string, beatmap_id: number, modifier: number) {
		this.beatmap_name = beatmap_name;
		this.beatmap_id = beatmap_id;
		this.modifier = modifier;
	}
}
