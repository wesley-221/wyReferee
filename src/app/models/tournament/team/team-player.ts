export class TeamPlayer {
	id: number;
	username: string;

    constructor() { }

	/**
	 * Create a true copy of the object
	 * @param teamPlayer the object to copy
	 */
    static makeTrueCopy(teamPlayer: TeamPlayer): TeamPlayer {
        const newTeamPlayer = new TeamPlayer();

		newTeamPlayer.id = teamPlayer.id;
        newTeamPlayer.username = teamPlayer.username;

        return newTeamPlayer;
	}

	/**
	 * Convert the object to a json object
	 */
	convertToJson() {
		return {
			id: this.id,
			username: this.username
		}
	}

	/**
	 * Compare current team player with the given team player
	 * @param that the team player to compare
	 * @returns true if equal
	 */
	public compareTo(that: TeamPlayer) {
		return this.username == that.username;
	}
}
