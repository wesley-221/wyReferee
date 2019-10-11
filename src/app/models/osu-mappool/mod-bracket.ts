import { Mods } from "../osu-models/osu-api";
import { ModBracketMap } from "./mod-bracket-map";

export class ModBracket {
    id: number;
    bracketName: string;
    mods: string;
    private beatmaps: ModBracketMap[] = [];

    getBeatmaps() {
        return this.beatmaps;
    }

    /**
     * Add a beatmap to the mod bracket
     * @param map the map to add to the bracket
     */
    public addBeatmap(map: ModBracketMap) {
        this.beatmaps.push(map);
    }

    /**
     * Remove a map from the bracket
     * @param map the map to remove from the bracket
     */
    public removeMap(map: ModBracketMap) {
        this.beatmaps.splice(this.beatmaps.indexOf(map), 1);
    }
}
