export class TeamPlayer {
	username: string;

    constructor() { }

	/**
	 * Create a true copy of the object
	 * @param teamPlayer the object to copy
	 */
    static makeTrueCopy(teamPlayer: TeamPlayer): TeamPlayer {
        const newTeamPlayer = new TeamPlayer();

        newTeamPlayer.username = teamPlayer.username;

        return newTeamPlayer;
	}

	/**
	 * Convert the object to a json object
	 */
	convertToJson() {
		return {
			username: this.username
		}
	}
}
