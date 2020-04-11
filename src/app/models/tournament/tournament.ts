import { Team } from "./team/team";

export class Tournament {
	tournamentId: number;
	tournamentName: string;
	acronym: string;
	teams: Team[];
	tournamentScoreInterfaceIdentifier: string;
	teamSize: number;

	constructor() {
        this.teams = [];
	}

	/**
	 * Get the teams of a tournament
	 */
	getTeams(): Team[] {
		return this.teams;
	}

	/**
	 * Add a team to the tournament
	 * @param team the team to add
	 */
	addTeam(team: Team) {
		this.teams.push(team);
	}

	/**
	 * Remove a team from the tournament
	 * @param team the team to remove
	 */
	removeTeam(team: Team) {
		this.teams.splice(this.teams.indexOf(team), 1);
	}

	/**
	 * Create a true copy of the object
	 * @param tournament the object to make a copy of
	 */
	static makeTrueCopy(tournament: Tournament) {
		const newTournament = new Tournament();

		newTournament.tournamentId = tournament.tournamentId;
		newTournament.tournamentName = tournament.tournamentName;
		newTournament.acronym = tournament.acronym;
		newTournament.teamSize = tournament.teamSize;
		newTournament.tournamentScoreInterfaceIdentifier = tournament.tournamentScoreInterfaceIdentifier;

		for(let team in tournament.teams) {
			newTournament.teams.push(Team.makeTrueCopy(tournament.teams[team]));
		}

		return newTournament;
	}

	/**
	 * Convert the object to a json object
	 */
	convertToJson() {
		let tournament =  {
			tournamentId: this.tournamentId,
			tournamentName: this.tournamentName,
			acronym: this.acronym,
			teamSize: this.teamSize,
			scoreInterfaceIdentifier: this.tournamentScoreInterfaceIdentifier,
			teams: []
		};

		for(let team in this.teams) {
			tournament.teams.push(this.teams[team].convertToJson());
		}

		return tournament;
	}
}
