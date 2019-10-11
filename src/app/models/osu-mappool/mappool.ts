import { ModBracket } from "./mod-bracket";

export class Mappool {
    id: number;
    name: string;

    private modBrackets: ModBracket[] = [];

    constructor() { }

    public getModBracket(id: number) {
        let modBracket: ModBracket;

        for(let bracket in this.modBrackets) {
            if(this.modBrackets[bracket].id == id) {
                modBracket = this.modBrackets[bracket];
                break;
            }
        }

        return (modBracket != null) ? modBracket : null;
    }

    public getAllBrackets() {
        return this.modBrackets;
    }

    public addBracket(modBracket: ModBracket) {
        this.modBrackets.push(modBracket);
    }

    public removeBracket(modBracket: ModBracket) {
        this.modBrackets.splice(this.modBrackets.indexOf(modBracket), 1);
    }
}
