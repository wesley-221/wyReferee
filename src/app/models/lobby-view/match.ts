import { Player } from "./player";
import { Team } from "./team";

export class Match {
    players: Player[] = [];
    teams: Team[] = [];

    /**
     * Add a player to the lobby
     * @param player the player to add to the lobby
     */
    addPlayer(player: Player) {
        this.players.push(player);
    }

    /**
     * Remove a player from the lobby
     * @param player the player to remove from the lobby
     */
    removePlayer(player: Player) {
        this.players.splice(this.players.indexOf(player), 1);
    }

    /**
     * Add a team to the lobby
     * @param team the team to add to the lobby
     */
    addTeam(team: Team) {
        this.teams.push(team);
    }

    /**
     * Remove a team from the lobby
     * @param team the team to remove from the lobby
     */
    removeTeam(team: Team) {
        this.teams.splice(this.teams.indexOf(team), 1);
    }
}
