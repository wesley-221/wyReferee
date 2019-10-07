export class CacheBeatmap {
    name: string;
    beatmap_id: number;
    beatmapset_id: number

    constructor(name: string, beatmap_id: number, beatmapset_id: number) {
        this.name = name;
        this.beatmap_id = beatmap_id;
        this.beatmapset_id = beatmapset_id;
    }
}