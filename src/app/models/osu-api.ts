export class OsuApi {
    protected url: string = "https://osu.ppy.sh/";
    protected endpoint: string = "api/get_beatmaps";
    protected key: string;

    constructor(key: string) {
        this.key = key;
    }
}
