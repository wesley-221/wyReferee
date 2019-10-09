import { Mods } from "../osu-models/osu-api";
import { ModBracketMap } from "./mod-bracket-map";

export class ModBracket {
    bracketName: string;
    mods: Mods[] = [];
    private beatmaps: ModBracketMap[] = [];

    /**
     * Add a mod so that it can be used in the irc client when picking a map
     * @param mod the mod to add to the bracket
     */
    public addMod(mod: Mods) {
        this.mods.push(mod);
    }

    /**
     * Remove a mod from the bracket
     * @param mod the mod to remove from the bracket
     */
    public removeMod(mod: Mods) {
        this.mods.splice(this.mods.indexOf(mod), 1);
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
