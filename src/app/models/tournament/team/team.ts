import { TeamPlayer } from './team-player';

export class Team {
	id: number;
	teamName: string;
	collapsed = false;
	teamPlayers: TeamPlayer[];
	validateIndex = 0;

	constructor() {
		this.teamPlayers = [];
	}

    /**
     * Get all the players
     */
	public getPlayers(): TeamPlayer[] {
		return this.teamPlayers;
	}

    /**
     * Add a player to the team
     * @param teamPlayer
     */
	public addPlayer(teamPlayer: TeamPlayer): void {
		this.teamPlayers.push(teamPlayer);
	}

    /**
     * Remove a player from the team
     * @param teamPlayer
     */
	public removePlayer(teamPlayer: TeamPlayer): void {
		this.teamPlayers.splice(this.teamPlayers.indexOf(teamPlayer), 1);
	}

    /**
     * Get all the players in an array
     */
	public getPlayersAsArray(): string[] {
		const returnArray: string[] = [];

		for (const player of this.teamPlayers) {
			returnArray.push(player.username);
		}

		return returnArray;
	}

	/**
	 * Create a true copy of the object
	 * @param team the object to make a copy of
	 */
	static makeTrueCopy(team: Team): Team {
		const newTeam = new Team();

		newTeam.id = team.id;
		newTeam.teamName = team.teamName;

		for (const player in team.teamPlayers) {
			newTeam.addPlayer(TeamPlayer.makeTrueCopy(team.teamPlayers[player]));
		}

		return newTeam;
	}

	/**
	 * Convert the object to a json object
	 */
	convertToJson() {
		const team = {
			id: this.id,
			teamName: this.teamName,
			teamPlayers: []
		}

		for (const player in this.teamPlayers) {
			team.teamPlayers.push(this.teamPlayers[player].convertToJson());
		}

		return team;
	}

	/**
	 * Compare current team with the given team
	 * @param that the team to compare
	 * @returns true if equal
	 */
	public compareTo(that: Team) {
		for (const teamPlayer in this.teamPlayers) {
			if (this.teamPlayers[teamPlayer].username != that.teamPlayers[teamPlayer].username) {
				return false;
			}
		}

		return (
			this.teamName == that.teamName &&
			this.teamPlayers.length == that.teamPlayers.length
		);
	}
}
