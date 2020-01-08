import { ModBracket } from "./mod-bracket";
import { ModBracketMap } from "./mod-bracket-map";
import { Gamemodes } from "../osu-models/osu-api";

export class Mappool {
    id: number = null;
    publish_id: string = null;
    name: string;
    modBrackets: ModBracket[] = [];
    modifiers: {} = {};
    allBeatmaps: any[] = [];
    gamemodeId: Gamemodes = Gamemodes.Osu;

    constructor() {}

    /**
     * Get all the mod brackets
     */
    public getAllBrackets() {
        return this.modBrackets;
    }

    /**
     * Add a modbracket to the mappool
     * @param modBracket the modbracket to add
     */
    public addBracket(modBracket: ModBracket) {
        this.modBrackets.push(modBracket);
    }

    /**
     * Convert the mappool object to json format
     */
    public convertToJson(): any {
        let mappool = {
            id: this.id,
            publish_id: this.publish_id,
            name: this.name,
            brackets: [], 
            modifiers: {},
            gamemode: this.gamemodeId
        };

        for(let bracket in this.modBrackets) {
            const thisBracket = this.modBrackets[bracket];

            let newBracket = {
                id: (thisBracket.id == null) ? parseInt(bracket) : thisBracket.id,
                bracketName: thisBracket.bracketName,
                mods: thisBracket.mods,
                beatmaps: {}
            };

            for(let map in thisBracket.beatmaps) {
                const thisMap = thisBracket.beatmaps[map];
                if(thisMap.beatmapId == null) continue;

                newBracket.beatmaps[map] = thisMap.beatmapId;

                mappool.modifiers[thisMap.beatmapId] = {
                    beatmapId: thisMap.beatmapId,
                    beatmapName: thisMap.beatmapName,
                    beatmapUrl: thisMap.beatmapUrl,
                    modifier: thisMap.modifier, 
                    gamemode: this.gamemodeId
                };
            }

            mappool.brackets.push(newBracket);
        }

        return mappool;
    }

    /**
     * Make a true copy of the given mappool
     * @param mappool the mappool
     */
    public static makeTrueCopy(mappool: Mappool): Mappool {
        const newMappool = new Mappool();

        newMappool.id = mappool.id;
        newMappool.publish_id = mappool.publish_id;
        newMappool.name = mappool.name;
        newMappool.modBrackets = mappool.modBrackets;
        newMappool.modifiers = mappool.modifiers;
        newMappool.gamemodeId = mappool.gamemodeId;

        return newMappool;
    }

    /**
     * Create a new token used for publishing a mappool
     * @param tokenLength the length of the token
     */
    public static generatePublishToken(tokenLength: number = 35): string {
        let token = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@%^&*()_+-=';

        for (let i = 0; i < tokenLength; i ++ ) {
            token += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return token;
    }

    /**
     * Serialize the json so that it gives back a mappool object
     * @param json the json to serialize
     */
    public static serializeJson(json: any): Mappool {
        const 	thisMappool = json, 
                newMappool = new Mappool();

        newMappool.id = thisMappool.id
        newMappool.publish_id = thisMappool.publish_id;
        newMappool.name = thisMappool.name;
        newMappool.gamemodeId = thisMappool.gamemode;

        // Loop through all the brackets in the current mappool
        for(let bracket in thisMappool.brackets) {
            const 	thisBracket = thisMappool.brackets[bracket],
                    newBracket = new ModBracket();

            newBracket.id = thisBracket.id;
            newBracket.mods = thisBracket.mods;
            newBracket.bracketName = thisBracket.bracketName;

            // Loop through all the beatmaps in the current bracket
            for(let beatmap in thisBracket.beatmaps) {
                const newBeatmap = new ModBracketMap();

                newBeatmap.beatmapId = thisBracket.beatmaps[beatmap];
                newBeatmap.beatmapName = thisMappool.modifiers[newBeatmap.beatmapId].beatmapName;
                newBeatmap.beatmapUrl = thisMappool.modifiers[newBeatmap.beatmapId].beatmapUrl;
                newBeatmap.modifier = thisMappool.modifiers[newBeatmap.beatmapId].modifier;
                newBeatmap.gamemodeId = thisMappool.gamemode;
                newBeatmap.invalid = false;

                newBracket.addBeatmap(newBeatmap);

                newMappool.modifiers[newBeatmap.beatmapId] = newBeatmap;
                
                newMappool.allBeatmaps.push({
                    beatmapId: thisBracket.beatmaps[beatmap],
                    name: thisMappool.modifiers[newBeatmap.beatmapId].beatmapName,
                    mod: thisBracket.mods
                });
            }

            newMappool.addBracket(newBracket);
        }

        return newMappool;
    }
}
