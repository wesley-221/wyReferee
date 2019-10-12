import { Mods } from "../osu-models/osu-api";
import { MultiplayerDataUser } from "./multiplayer-data-user";

export class MultiplayerData {
    game_id: number;
    beatmap_id: number;
    mods: Mods;
    team_one_score: number;
    team_two_score: number;
    private players: {};

    constructor() {
        this.players = [];
    }

    /**
     * Add a player to the MultiplayerData
     * @param player the player to add
     */
    addPlayer(player: MultiplayerDataUser) {
        this.players[player.slot] = player;
    }

    /**
     * Get a specific player from the given slot
     * @param slot the slot of the player
     */
    getPlayer(slot: number) {
        const player = new MultiplayerDataUser();

        if(this.players[slot] == undefined) {
            player.user = 0;
            player.accuracy = 0;
            player.score = 0;
            player.passed = 0;
            player.slot = slot;
        }

        return (this.players[slot] == undefined) ? player : this.players[slot];
    }

    /**
     * Return all the players
     */
    getPlayers(): {} {
        return this.players;
    }

    /**
     * Get the player count
     */
    getPlayerCount() {
        return Object.keys(this.players).length;
    }
}
