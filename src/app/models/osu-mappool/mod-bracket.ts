import { ModBracketMap } from "./mod-bracket-map";

export class ModBracket {
    id: number;
    bracketName: string;
    mods: string;
    beatmaps: ModBracketMap[] = [];
    collapsed: boolean = false; // Used for showing/hiding the body when creating a bracket

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

    /**
     * Make a true copy of the given bracket
     * @param bracket the bracket
     */
    public static makeTrueCopy(bracket: ModBracket): ModBracket {
        const newBracket = new ModBracket();

        newBracket.id = bracket.id
        newBracket.bracketName = bracket.bracketName;
        newBracket.mods = bracket.mods

        // Make true copies of the beatmaps
        for(let beatmap in bracket.beatmaps) {
            newBracket.beatmaps.push(ModBracketMap.makeTrueCopy(bracket.beatmaps[beatmap]));
        }

        newBracket.collapsed = bracket.collapsed

        return newBracket;
    }
}
