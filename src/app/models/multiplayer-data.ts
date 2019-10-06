import { Mods } from "./osu-api";
import { MultiplayerDataUser } from "./multiplayer-data-user";

export class MultiplayerData {
    beatmap_id: number;
    mods: Mods;
    team_one_score: number;
    team_two_score: number;

    private players: MultiplayerDataUser[];

    constructor() {
        this.players = [];
    }

    addPlayer(player: MultiplayerDataUser) {
        this.players.push(player);
    }
}
