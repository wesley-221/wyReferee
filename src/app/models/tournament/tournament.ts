import { Team } from "./team/team";
import { TeamPlayer } from "./team/team-player";
import { ScoreInterface } from "../score-calculation/calculation-types/score-interface";
import { Calculate } from "../score-calculation/calculate";

export class Tournament {
	id: number;
	tournamentName: string;
	acronym: string;
	teams: Team[];
	tournamentScoreInterfaceIdentifier: string;
	scoreInterface: ScoreInterface;
	teamSize: number;
	publishId: number;
	updateAvailable: boolean = false;

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
	 * Convert the object to a json object
	 */
	convertToJson(): any {
		let tournament = {
			id: this.id,
			tournamentName: this.tournamentName,
			acronym: this.acronym,
			teamSize: this.teamSize,
			scoreInterfaceIdentifier: this.tournamentScoreInterfaceIdentifier,
			tournamentScoreInterfaceIdentifier: this.tournamentScoreInterfaceIdentifier,
			teams: [],
			publishId: this.publishId
		};

		for (let team in this.teams) {
			tournament.teams.push(this.teams[team].convertToJson());
		}

		return tournament;
	}

	/**
	 * Create a true copy of the object
	 * @param tournament the object to make a copy of
	 */
	static makeTrueCopy(tournament: Tournament) {
		const newTournament = new Tournament(),
			calc = new Calculate();

		newTournament.id = tournament.id;
		newTournament.tournamentName = tournament.tournamentName;
		newTournament.acronym = tournament.acronym;
		newTournament.teamSize = tournament.teamSize;
		newTournament.tournamentScoreInterfaceIdentifier = tournament.tournamentScoreInterfaceIdentifier;
		newTournament.scoreInterface = calc.getScoreInterface(newTournament.tournamentScoreInterfaceIdentifier);
		newTournament.publishId = tournament.publishId;

		for (let team in tournament.teams) {
			newTournament.teams.push(Team.makeTrueCopy(tournament.teams[team]));
		}

		return newTournament;
	}

	/**
	 * Serialize the json so that it gives back a tournament object
	 * @param json the json to serialize
	 */
	public static serializeJson(json: any): Tournament {
		const thisTournament = json,
			newTournament = new Tournament(),
			calc = new Calculate();

		newTournament.id = thisTournament.tournamentId;
		newTournament.tournamentName = thisTournament.tournamentName;
		newTournament.acronym = thisTournament.acronym;
		newTournament.teamSize = thisTournament.teamSize;
		newTournament.tournamentScoreInterfaceIdentifier = thisTournament.scoreInterfaceIdentifier;
		newTournament.scoreInterface = calc.getScoreInterface(newTournament.tournamentScoreInterfaceIdentifier);
		newTournament.publishId = thisTournament.publishId;

		for (let team in thisTournament.teams) {
			const newTeam = new Team();
			newTeam.teamName = thisTournament.teams[team].teamName;

			for (let player in thisTournament.teams[team].teamPlayers) {
				const newPlayer = new TeamPlayer();
				newPlayer.username = thisTournament.teams[team].teamPlayers[player].username;

				newTeam.addPlayer(newPlayer);
			}

			newTournament.addTeam(newTeam);
		}

		return newTournament;
	}
}
