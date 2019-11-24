import { Match } from "./match";

export class Lobby {
    matches: Match[] = [];

    /**
     * Add a match to the lobby
     * @param match the match to add to the lobby
     */
    addMatch(match: Match) {
        this.matches.push(match);
    }

    /**
     * Remove a match from the lobby
     * @param match the match to remove from the lobby
     */
    removeMatch(match: Match) {
        this.matches.splice(this.matches.indexOf(match), 1);
    }
}
