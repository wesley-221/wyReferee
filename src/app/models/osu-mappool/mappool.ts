import { ModBracket } from "./mod-bracket";

export class Mappool {
    id: number = null;
    name: string;
    modBrackets: ModBracket[] = [];
    modifiers: {} = {};

    constructor() { }

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
            name: this.name,
            brackets: [], 
            modifiers: {}
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
                    modifier: thisMap.modifier
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
        newMappool.name = mappool.name;
        newMappool.modBrackets = mappool.modBrackets;
        newMappool.modifiers = mappool.modifiers;

        return newMappool;
    }
}
