export class Player {
    username: string;
    score: number;
    accuracy: number;
    slot: number;
    description: string;

    constructor(username: string, score: number, accuracy: number, slot: number, description: string = null) {
        this.username = username;
        this.score = score;
        this.accuracy = accuracy;
        this.slot = slot;
        this.description = description;
    }
}
