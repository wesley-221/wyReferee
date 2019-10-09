export class ModBracketMap {
    beatmapId: number;
    beatmapName: string;
    modifier: number;

    constructor(beatmapId: number, beatmapName: string, modifier: number) {
        this.beatmapId = beatmapId;
        this.beatmapName = beatmapName;
        this.modifier = modifier;
    }
}
