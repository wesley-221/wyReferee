import { Injectable } from '@angular/core';
import { AppConfig } from '../../environments/environment';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Injectable({
	providedIn: 'root'
})

export class TournamentService {
	private readonly apiUrl = AppConfig.apiUrl;

	allTournaments: WyTournament[];
	availableTournamentId: number;

	constructor(private storeService: StoreService, private httpClient: HttpClient) {
		this.availableTournamentId = 0;
		this.allTournaments = [];

		const storeAllTournaments = this.storeService.get('cache.tournaments');

		for (const tournament in storeAllTournaments) {
			const newTournament = WyTournament.makeTrueCopy(storeAllTournaments[tournament]);
			this.availableTournamentId = newTournament.id + 1;

			this.allTournaments.push(newTournament);

			// if (newTournament.publishId != undefined) {
			// 	this.getPublishedTournament(newTournament.publishId).subscribe((data) => {
			// 		const updatedTournament: Tournament = Tournament.serializeJson(data);
			// 		newTournament.updateAvailable = !newTournament.compareTo(updatedTournament);

			// 		this.allTournaments.push(newTournament);
			// 	}, () => {
			// 		this.allTournaments.push(newTournament);
			// 	});
			// }
			// else {
			// 	this.allTournaments.push(newTournament);
			// }
		}
	}

	/**
	 * Save a tournament and increment the available tournament id
	 * @param tournament the tournament to save
	 */
	saveTournament(tournament: WyTournament): void {
		tournament.id = this.availableTournamentId++;

		this.allTournaments.push(tournament);
		this.storeService.set(`cache.tournaments.${tournament.id}`, tournament);
	}

	/**
	 * Update a tournament
	 * @param tournament the tournament to update
	 */
	updateTournament(tournament: WyTournament): void {
		for (const findTournament in this.allTournaments) {
			if (this.allTournaments[findTournament].id == tournament.id) {
				this.allTournaments[findTournament] = WyTournament.makeTrueCopy(tournament);
				break;
			}
		}

		this.storeService.set(`cache.tournaments.${tournament.id}`, tournament);
	}

	/**
	 * Delete the tournament from the cache and service
	 * @param tournament the tournament to delete
	 */
	deleteTournament(tournament: WyTournament): void {
		this.allTournaments.splice(this.allTournaments.indexOf(tournament), 1);
		this.storeService.delete(`cache.tournaments.${tournament.id}`);
	}

	/**
	 * Get a tournament by the given id
	 * @param id the id of the tournament to get
	 */
	getTournamentById(id: number): WyTournament {
		let returnTournament: WyTournament = null;

		for (const tournament in this.allTournaments) {
			if (this.allTournaments[tournament].id == id) {
				returnTournament = this.allTournaments[tournament];
				break;
			}
		}

		return returnTournament;
	}

	// /**
	//  * Update a published tournament
	//  * @param tournament the tournament to update
	//  */
	// public updatePublishedTournament(tournament: Tournament) {
	// 	return this.httpClient.post<Tournament>(`${this.apiUrl}wyreferee/tournament`, tournament, { observe: 'response' });
	// }

	// /**
	//  * Replace the original tournament with the new tournament
	//  * @param originalTournament the tournament to replace
	//  * @param updatedTournament the tournament with the new values
	//  */
	// public replaceTournament(originalTournament: Tournament, updatedTournament: Tournament) {
	// 	for (const i in this.allTournaments) {
	// 		if (this.allTournaments[i].id == originalTournament.id) {
	// 			updatedTournament.id = originalTournament.id;
	// 			this.allTournaments[i] = updatedTournament;

	// 			this.storeService.set(`cache.tournaments.${originalTournament.id}`, updatedTournament.convertToJson());
	// 			return;
	// 		}
	// 	}
	// }

	// /**
	//  * Publish a tournament
	//  * @param tournament the tournament to publish
	//  */
	// publishTournament(tournament: Tournament): Observable<any> {
	// 	return this.httpClient.post<Tournament>(`${this.apiUrl}wyreferee/tournament`, tournament, { observe: 'response' });
	// }

	// /**
	//  * Get a published tournament by tournament id
	//  * @param tournamentId the id of the tournament that was published
	//  */
	// getPublishedTournament(tournamentId: number): Observable<Tournament> {
	// 	return this.httpClient.get<Tournament>(`${this.apiUrl}wyreferee/tournament/${tournamentId}`);
	// }

	// /**
	//  * Get all the published tournaments from the given user
	//  * @param user the user to get all the tournaments from
	//  */
	// getAllPublishedTournamentsFromUser(user: User) {
	// 	return this.httpClient.get<Tournament[]>(`${this.apiUrl}wyreferee/tournament/created_by/${user.id}`);
	// }

	// /**
	//  * Get all published tournaments
	//  */
	// getAllPublishedTournaments() {
	// 	return this.httpClient.get<Tournament[]>(`${this.apiUrl}wyreferee/tournament`);
	// }

	// /**
	//  * Delete a tournament
	//  * @param tournament the tournament to delete
	//  */
	// deletePublishedTournament(tournament: Tournament) {
	// 	return this.httpClient.delete<Tournament>(`${this.apiUrl}wyreferee/tournament/${tournament.id}`);
	// }

	// /**
	//  * Get a tournament by the given name
	//  * @param tournamentName the tournament name
	//  */
	// getTournamentByName(tournamentName: string): Tournament {
	// 	for (const tournament of this.allTournaments) {
	// 		if (tournament.tournamentName == tournamentName) {
	// 			return tournament;
	// 		}
	// 	}

	// 	return null;
	// }

	// /**
	//  * Get a tournament by the given acronym
	//  * @param acronym the tournament acronym
	//  */
	// getTournamentByAcronym(acronym: string): Tournament {
	// 	for (const tournament of this.allTournaments) {
	// 		if (tournament.acronym == acronym) {
	// 			return tournament;
	// 		}
	// 	}

	// 	return null;
	// }

	// /**
	//  * Get the team from the given tournament by the given name
	//  * @param tournament the tournament to search in
	//  * @param teamName the team to search for
	//  */
	// getTeamFromTournamentByName(tournament: Tournament, teamName: string) {
	// 	for (const team of tournament.teams) {
	// 		if (team.teamName == teamName) {
	// 			return team;
	// 		}
	// 	}

	// 	return null;
	// }
}

