import { Injectable } from '@angular/core';
import { AppConfig } from '../../environments/environment';
import { Tournament } from '../models/tournament/tournament';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { Team } from '../models/tournament/team/team';
import { TeamPlayer } from '../models/tournament/team/team-player';
import { Observable } from 'rxjs';
import { LoggedInUser } from '../models/authentication/logged-in-user';
import { Calculate } from '../models/score-calculation/calculate';

@Injectable({
	providedIn: 'root'
})

export class TournamentService {
	private readonly apiUrl = AppConfig.apiUrl;

	allTournaments: Tournament[];
	availableTournamentId = 0;

	constructor(private storeService: StoreService, private httpClient: HttpClient) {
		this.allTournaments = [];

		const storeAllTournaments = this.storeService.get('cache.tournaments');

		for (const tournament in storeAllTournaments) {
			const thisMappool = storeAllTournaments[tournament];
			const newTournament = Tournament.serializeJson(thisMappool);

			newTournament.id = thisMappool.id;
			this.availableTournamentId = newTournament.id + 1;

			if (newTournament.publishId != undefined) {
				this.getPublishedTournament(newTournament.publishId).subscribe((data) => {
					const updatedTournament: Tournament = this.mapFromJson(data);
					newTournament.updateAvailable = !newTournament.compareTo(updatedTournament);

					this.allTournaments.push(newTournament);
				}, () => {
					this.allTournaments.push(newTournament);
				});
			}
			else {
				this.allTournaments.push(newTournament);
			}
		}
	}

	/**
	 * Get a tournament by the given id
	 * @param tournamentId the id of the tournament to get
	 */
	getTournament(tournamentId: number): Tournament {
		let returnTournamentl: Tournament = null;

		for (const i in this.allTournaments) {
			if (this.allTournaments[i].id == tournamentId) {
				returnTournamentl = this.allTournaments[i];
				break;
			}
		}

		return returnTournamentl;
	}

	/**
	 * Save the tournament in the store and add it to the service
	 * @param tournament the tournament to save
	 */
	public saveTournament(tournament: Tournament): void {
		tournament.id = this.availableTournamentId++;

		this.allTournaments.push(tournament);
		this.storeService.set(`cache.tournaments.${tournament.id}`, tournament.convertToJson());
	}

	/**
	 * Update an existing tournament with new values
	 * @param tournament the tournament to update
	 */
	updateTournament(tournament: Tournament): void {
		for (const i in this.allTournaments) {
			if (this.allTournaments[i].id == tournament.id) {
				this.allTournaments[i] = tournament;

				this.storeService.set(`cache.tournaments.${tournament.id}`, tournament.convertToJson());
				return;
			}
		}
	}

	/**
	 * Update a published tournament
	 * @param tournament the tournament to update
	 */
	public updatePublishedTournament(tournament: Tournament) {
		return this.httpClient.post<Tournament>(`${this.apiUrl}tournament`, tournament, { observe: 'response' });
	}

	/**
	 * Replace the original tournament with the new tournament
	 * @param originalTournament the tournament to replace
	 * @param updatedTournament the tournament with the new values
	 */
	public replaceTournament(originalTournament: Tournament, updatedTournament: Tournament) {
		for (const i in this.allTournaments) {
			if (this.allTournaments[i].id == originalTournament.id) {
				updatedTournament.id = originalTournament.id;
				this.allTournaments[i] = updatedTournament;

				this.storeService.set(`cache.tournaments.${originalTournament.id}`, updatedTournament.convertToJson());
				return;
			}
		}
	}

	/**
	 * Delete the tournament in the store and service
	 * @param tournament the tournament to delete
	 */
	deleteTournament(tournament: Tournament): void {
		this.allTournaments.splice(this.allTournaments.indexOf(tournament), 1);
		this.storeService.delete(`cache.tournaments.${tournament.id}`);
	}

	/**
	 * Publish a tournament
	 * @param tournament the tournament to publish
	 */
	publishTournament(tournament: Tournament): Observable<any> {
		return this.httpClient.post<Tournament>(`${this.apiUrl}tournament`, tournament, { observe: 'response' });
	}

	/**
	 * Get a published tournament by tournament id
	 * @param tournamentId the id of the tournament that was published
	 */
	getPublishedTournament(tournamentId: number): Observable<Tournament> {
		return this.httpClient.get<Tournament>(`${this.apiUrl}tournament/${tournamentId}`);
	}

	/**
	 * Get all the published tournaments from the given user
	 * @param user the user to get all the tournaments from
	 */
	getAllPublishedTournamentsFromUser(user: LoggedInUser) {
		return this.httpClient.get<Tournament[]>(`${this.apiUrl}tournament/created_by/${user.userId}`);
	}

	/**
	 * Delete a tournament
	 * @param tournament the tournament to delete
	 */
	deletePublishedTournament(tournament: Tournament) {
		return this.httpClient.delete<Tournament>(`${this.apiUrl}tournament/${tournament.id}`);
	}

	/**
	 * Get a tournament by the given name
	 * @param tournamentName the tournament name
	 */
	getTournamentByName(tournamentName: string): Tournament {
		for (const tournament of this.allTournaments) {
			if (tournament.tournamentName == tournamentName) {
				return tournament;
			}
		}

		return null;
	}

	/**
	 * Get a tournament by the given acronym
	 * @param acronym the tournament acronym
	 */
	getTournamentByAcronym(acronym: string): Tournament {
		for (const tournament of this.allTournaments) {
			if (tournament.acronym == acronym) {
				return tournament;
			}
		}

		return null;
	}

	/**
	 * Get the team from the given tournament by the given name
	 * @param tournament the tournament to search in
	 * @param teamName the team to search for
	 */
	getTeamFromTournamentByName(tournament: Tournament, teamName: string) {
		for (const team of tournament.teams) {
			if (team.teamName == teamName) {
				return team;
			}
		}

		return null;
	}

	/**
	 * Map the given json to a tournament object
	 * @param json the json to map
	 */
	mapFromJson(json: any) {
		const newTournament = new Tournament();
		const calc = new Calculate();

		newTournament.id = json.id;
		newTournament.tournamentName = json.tournamentName;
		newTournament.acronym = json.acronym;
		newTournament.teamSize = json.teamSize;
		newTournament.tournamentScoreInterfaceIdentifier = json.tournamentScoreInterfaceIdentifier;
		newTournament.scoreInterface = calc.getScoreInterface(newTournament.tournamentScoreInterfaceIdentifier);
		newTournament.publishId = json.id;
		newTournament.format = json.format;

		let validateIndex = 0;

		for (const team in json.teams) {
			const newTeam = new Team();
			newTeam.teamName = json.teams[team].teamName;
			newTeam.validateIndex = validateIndex;

			for (const player in json.teams[team].teamPlayers) {
				const newPlayer = new TeamPlayer();
				newPlayer.username = json.teams[team].teamPlayers[player].username;

				newTeam.addPlayer(newPlayer);
			}

			newTournament.addTeam(newTeam);
			validateIndex++;
		}

		return newTournament;
	}
}

