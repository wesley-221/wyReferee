import { Player } from "./player";

export class Team {
    name: string;
    private players: Player[] = [];

    constructor(name: string) {
        this.name = name;
    }

    /**
     * Add a player to the team
     * @param player the player to add
     */
    addPlayer(player: Player) {
        this.players.push(player);
    }

    /**
     * Remove a player from the team
     * @param player the player to remove
     */
    removePlayer(player: Player) {
        this.players.splice(this.players.indexOf(player), 1);
    }
}
