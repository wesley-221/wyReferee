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
}
