import { Team } from './team/team';
import { TeamPlayer } from './team/team-player';
import { ScoreInterface } from '../score-calculation/calculation-types/score-interface';
import { Calculate } from '../score-calculation/calculate';
import { User } from '../authentication/user';

export enum TournamentFormat {
	Solo = 'solo',
	Teams = 'teams'
}

export class Tournament {
	id: number;
	tournamentName: string;
	acronym: string;
	teams: Team[];
	format: TournamentFormat;
	tournamentScoreInterfaceIdentifier: string;
	scoreInterface: ScoreInterface;
	teamSize: number;
	challongeIntegration: number;
	challongeApiKey: string;
	challongeTournamentId: number;
	challongeCreationType: number;
	availableTo: User[] = [];
	publishId: number;
	updateAvailable = false;
	createdByUser: { id: number, slug: string, username: string; };

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
	 * Allow the user to view the mappool
	 * @param user
	 */
	public addUser(user: User) {
		this.availableTo.push(user);
	}

	/**
	 * Remove the permissions for the user to view the mappool
	 * @param user
	 */
	public removeUser(user: User) {
		this.availableTo.splice(this.availableTo.indexOf(user), 1);
	}

	/**
	 * Check if the tournament is a solo tournament
	 */
	isSoloTournament() {
		return this.format == TournamentFormat.Solo;
	}

	/**
	 * Convert the object to a json object
	 */
	convertToJson(): any {
		const tournament = {
			id: this.id,
			tournamentName: this.tournamentName,
			acronym: this.acronym,
			teamSize: this.teamSize,
			format: this.format,
			scoreInterfaceIdentifier: this.tournamentScoreInterfaceIdentifier,
			tournamentScoreInterfaceIdentifier: this.tournamentScoreInterfaceIdentifier,
			teams: [],
			challongeIntegration: this.challongeIntegration,
			challongeApiKey: this.challongeApiKey,
			challongeTournamentId: this.challongeTournamentId,
			publishId: this.publishId,
			availableTo: [],
			createdByUser: {}
		};

		if (this.createdByUser) {
			tournament.createdByUser = {
				id: this.createdByUser.id,
				slug: this.createdByUser.slug,
				username: this.createdByUser.username
			}
		};

		for (const team in this.teams) {
			tournament.teams.push(this.teams[team].convertToJson());
		}

		for (const user in this.availableTo) {
			tournament.availableTo.push(User.makeTrueCopy(this.availableTo[user]));
		}

		return tournament;
	}

	/**
	 * Create a true copy of the object
	 * @param tournament the object to make a copy of
	 */
	static makeTrueCopy(tournament: Tournament) {
		const newTournament = new Tournament();
		const calc = new Calculate();

		newTournament.id = tournament.id;
		newTournament.tournamentName = tournament.tournamentName;
		newTournament.acronym = tournament.acronym;
		newTournament.teamSize = tournament.teamSize;
		newTournament.format = tournament.format;
		newTournament.tournamentScoreInterfaceIdentifier = tournament.tournamentScoreInterfaceIdentifier;
		newTournament.scoreInterface = calc.getScoreInterface(newTournament.tournamentScoreInterfaceIdentifier);
		newTournament.challongeIntegration = tournament.challongeIntegration;
		newTournament.challongeApiKey = tournament.challongeApiKey;
		newTournament.challongeTournamentId = tournament.challongeTournamentId;
		newTournament.publishId = tournament.publishId;

		if (tournament.createdByUser) {
			newTournament.createdByUser = {
				id: tournament.createdByUser.id,
				slug: tournament.createdByUser.slug,
				username: tournament.createdByUser.username
			}
		}

		for (const team in tournament.teams) {
			newTournament.teams.push(Team.makeTrueCopy(tournament.teams[team]));
		}

		for (const user in tournament.availableTo) {
			newTournament.availableTo.push(User.makeTrueCopy(tournament.availableTo[user]));
		}

		return newTournament;
	}

	/**
	 * Serialize the json so that it gives back a tournament object
	 * @param json the json to serialize
	 */
	public static serializeJson(json: any): Tournament {
		const thisTournament = json;
		const newTournament = new Tournament();
		const calc = new Calculate();

		newTournament.id = thisTournament.id;
		newTournament.tournamentName = thisTournament.tournamentName;
		newTournament.acronym = thisTournament.acronym;
		newTournament.teamSize = thisTournament.teamSize;
		newTournament.format = thisTournament.format;
		newTournament.tournamentScoreInterfaceIdentifier = thisTournament.tournamentScoreInterfaceIdentifier;
		newTournament.scoreInterface = calc.getScoreInterface(newTournament.tournamentScoreInterfaceIdentifier);
		newTournament.challongeIntegration = thisTournament.challongeIntegration;
		newTournament.challongeApiKey = thisTournament.challongeApiKey;
		newTournament.challongeTournamentId = thisTournament.challongeTournamentId;
		newTournament.publishId = thisTournament.publishId;

		if (json.createdByUser) {
			newTournament.createdByUser = {
				id: json.createdByUser.id,
				slug: json.createdByUser.slug,
				username: json.createdByUser.username
			}
		}

		for (const team in thisTournament.teams) {
			const newTeam = new Team();

			newTeam.id = thisTournament.teams[team].id;
			newTeam.teamName = thisTournament.teams[team].teamName;

			for (const player in thisTournament.teams[team].teamPlayers) {
				const newPlayer = new TeamPlayer();
				newPlayer.id = thisTournament.teams[team].teamPlayers[player].id;
				newPlayer.username = thisTournament.teams[team].teamPlayers[player].username;

				newTeam.addPlayer(newPlayer);
			}

			newTournament.addTeam(newTeam);
		}

		for (const user in json.availableTo) {
			newTournament.availableTo.push(User.serializeJson(thisTournament.availableTo[user]));
		}

		return newTournament;
	}

	/**
	 * Compare current tournament with the given tournament
	 * @param tournament the tournament to compare
	 * @returns true if equal
	 */
	public compareTo(that: Tournament) {
		for (const team in this.teams) {
			if (!this.teams[team].compareTo(that.teams[team])) {
				return false;
			}
		}

		// Ignore the challongeApiKey for comparing, since that'll only be available in the backend
		// unless you are the creator of the tournament
		return (
			this.tournamentName == that.tournamentName &&
			this.acronym == that.acronym &&
			this.teamSize == that.teamSize &&
			this.format == that.format &&
			this.tournamentScoreInterfaceIdentifier == that.tournamentScoreInterfaceIdentifier &&
			this.challongeIntegration == that.challongeIntegration &&
			this.challongeTournamentId == that.challongeTournamentId &&
			this.teams.length == that.teams.length &&
			this.availableTo.length == that.availableTo.length,
			(this.createdByUser != null ?
				this.createdByUser.id && this.createdByUser.id == that.createdByUser.id &&
				this.createdByUser.slug && this.createdByUser.slug == that.createdByUser.slug &&
				this.createdByUser.username && this.createdByUser.username == that.createdByUser.username
				: true)
		);
	}
}
