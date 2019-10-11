export enum ApprovedStatus {
    Loved = 4,
    Qualified = 3, 
    Approved = 2, 
    Ranked = 1,
    Pending = 0,
    WIP = -1,
    Graveyard = -2
}

export class Beatmap {
    approved: ApprovedStatus;
    submit_date: Date;
    approved_date: Date;
    last_update: Date;
    artist: string;
    beatmap_id: number;
    beatmapset_id: number;
    bpm: number;
    creator: string;
    creator_id: number;
    difficultyrating: number;
    diff_aim: number;
    diff_speed: number;
    diff_size: number;
    diff_overall: number;
    diff_approach: number;
    diff_drain: number;
    hit_length: number;
    source: string;
    genre_id: number;
    language_id: number;
    title: string;
    total_length: number;
    version: string;
    file_md5: string;
    mode: number;
    tags: string;
    favourite_count: number;
    rating: number;
    playcount: number;
    passcount: number;
    count_normal: number;
    count_slider: number;
    count_spinner: number;
    max_combo: number;
    download_unavailable: number;
    audio_unavailable: number;

    /**
     * Get the artist, title, version and creator of the beatmap
     */
    public getBeatmapname(): string {
        return `${this.artist} - ${this.title} [${this.version}] (${this.creator})`;
    }

    /**
     * Get the url from the beatmap using the old url
     */
    public getBeatmapUrl(): string {
        return `https://osu.ppy.sh/beatmaps/${this.beatmap_id}`;
    }
}
