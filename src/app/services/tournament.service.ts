import { Injectable } from '@angular/core';
import { AppConfig } from '../../environments/environment';
import { Tournament } from '../models/tournament/tournament';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { Team } from '../models/tournament/team/team';
import { TeamPlayer } from '../models/tournament/team/team-player';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class TournamentService {
	private readonly apiUrl = AppConfig.apiUrl;

	allTournaments: Tournament[];
	availableTournamentId: number = 0;

	constructor(private storeService: StoreService, private httpClient: HttpClient) {
		this.allTournaments = [];

		const allTournamentsCache = this.storeService.get(`cache.tournaments`);

		for(let tournament in allTournamentsCache) {
			const newTournament = new Tournament();
			newTournament.tournamentName = allTournamentsCache[tournament].tournamentName;
			newTournament.acronym = allTournamentsCache[tournament].acronym;
			this.availableTournamentId = newTournament.tournamentId + 1;

			for(let team in allTournamentsCache[tournament].teams) {
				const newTeam = new Team();
				newTeam.teamName = allTournamentsCache[tournament].teams[team].teamName;

				for(let player in allTournamentsCache[tournament].teams[team].teamPlayers) {
					const newPlayer = new TeamPlayer();
					newPlayer.username = allTournamentsCache[tournament].teams[team].teamPlayers[player].username;

					newTeam.addPlayer(newPlayer);
				}

				newTournament.addTeam(newTeam);
			}

			this.allTournaments.push(newTournament);
		}
	}

	/**
	 * Add a tournament to the service
	 * @param tournament the tournament to add to the service
	 */
	addTournament(tournament: Tournament): void {
		tournament.tournamentId = this.availableTournamentId;
		this.availableTournamentId ++;

		this.allTournaments.push(tournament);

		this.storeService.set(`cache.tournaments.${tournament.tournamentName}`, tournament.convertToJson());
	}

	/**
	 * Remove a tournament from the service
	 * @param tournament the tournament to remove from the service
	 */
	removeTournament(tournament: Tournament): void {
		this.allTournaments.splice(this.allTournaments.indexOf(tournament), 1);
		this.storeService.delete(`cache.tournaments.${tournament.tournamentName}`);
	}

	/**
	 * Update an existing tournament with new values
	 * @param oldTournament the original tournament to update
	 * @param newTournament the new tournament
	 */
	updateTournament(oldTournament: Tournament, newTournament: Tournament): void {
		for(let tournament in this.allTournaments) {
			if(this.allTournaments[tournament].tournamentName == oldTournament.tournamentName) {
				this.allTournaments[tournament] = newTournament;
			}
		}
	}

	/**
	 * Get a tournament by the given id
	 * @param tournamentId the id of the tournament to get
	 */
	getTournamentById(tournamentId: number): Tournament {
		for(let tournament of this.allTournaments) {
			if(tournament.tournamentId == tournamentId) {
				return tournament;
			}
		}

		return null;
	}

	/**
	 * Get a tournament by the given name
	 * @param tournamentName the tournament name
	 */
	getTournamentByName(tournamentName: string): Tournament {
		for(let tournament of this.allTournaments) {
			if(tournament.tournamentName == tournamentName) {
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
		for(let tournament of this.allTournaments) {
			if(tournament.acronym == acronym) {
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
		for(let team of tournament.teams) {
			if(team.teamName == teamName) {
				return team;
			}
		}

		return null;
	}

	/**
	 * Publish a tournament
	 * @param tournament the tournament to publish
	 */
	publishTournament(tournament: Tournament): Observable<any> {
		return this.httpClient.post<Tournament>(`${this.apiUrl}tournament/create`, tournament, { observe : "response" });
	}

	/**
	 * Get a published tournament by tournament id
	 * @param tournamentId the id of the tournament that was published
	 */
	getPublishedTournament(tournamentId: number): Observable<Tournament> {
		return this.httpClient.get<Tournament>(`${this.apiUrl}tournament/get/${tournamentId}`);
	}

	/**
	 * Map the given json to a tournament object
	 * @param json the json to map
	 */
	mapFromJson(json: any) {
		const newTournament = new Tournament();

		newTournament.tournamentName = json.tournamentName;
		newTournament.acronym = json.acronym;

		for(let team in json.teams) {
			const newTeam = new Team();
			newTeam.teamName = json.teams[team].teamName;

			for(let player in json.teams[team].teamPlayers) {
				const newPlayer = new TeamPlayer();
				newPlayer.username = json.teams[team].teamPlayers[player].username;

				newTeam.addPlayer(newPlayer);
			}

			newTournament.addTeam(newTeam);
		}

		return newTournament;
	}
}
