import { Injectable } from '@angular/core';
import { AppConfig } from '../../environments/environment';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { GenericService } from './generic.service';
import { ToastService } from './toast.service';
import { ToastType } from 'app/models/toast';

@Injectable({
	providedIn: 'root'
})

export class TournamentService {
	allTournaments: WyTournament[];
	availableTournamentId: number;

	private readonly apiUrl = AppConfig.apiUrl;
	private tournamentsInitialized$: BehaviorSubject<boolean>;

	constructor(private storeService: StoreService, private httpClient: HttpClient, private genericService: GenericService, private toastService: ToastService) {
		this.availableTournamentId = 0;
		this.allTournaments = [];

		this.tournamentsInitialized$ = new BehaviorSubject(false);

		this.updateFromPublishedTournaments(true);
	}

	/**
	 * Update all local tournaments with the published tournaments if they are updated
	 */
	updateFromPublishedTournaments(initialLoad: boolean): void {
		this.tournamentsInitialized$.next(false);

		this.genericService.getCacheHasBeenChecked().subscribe(checked => {
			if (checked == true) {
				if (initialLoad == true) {
					const storeAllTournaments = this.storeService.get('cache.tournaments');

					for (const tournament in storeAllTournaments) {
						const newTournament = WyTournament.makeTrueCopy(storeAllTournaments[tournament]);
						this.availableTournamentId = newTournament.id + 1;

						this.allTournaments.push(newTournament);
					}
				}

				// TODO: make a better solution for this
				setTimeout(() => {
					for (const tournament in this.allTournaments) {
						if (this.allTournaments[tournament].publishId != undefined) {
							this.getPublishedTournament(this.allTournaments[tournament].publishId).subscribe((data) => {
								const publishedTournament: WyTournament = WyTournament.makeTrueCopy(data);

								if (publishedTournament.updateDate.getTime() != this.allTournaments[tournament].updateDate.getTime()) {
									publishedTournament.publishId = publishedTournament.id;

									this.toastService.addToast(`The tournament "${this.allTournaments[tournament].name}" has been updated.`, ToastType.Information, 10);

									this.updateTournament(publishedTournament, this.allTournaments[tournament].publishId, true);
								}
							});
						}
					}

					this.tournamentsInitialized$.next(true);
				}, 1);
			}
		});
	}

	/**
	 * Check if the tournaments have been intialized
	 */
	tournamentsHaveBeenInitialized(): Observable<boolean> {
		return this.tournamentsInitialized$.asObservable();
	}

	/**
	 * Save a tournament and increment the available tournament id
	 *
	 * @param tournament the tournament to save
	 */
	saveTournament(tournament: WyTournament): void {
		tournament.id = this.availableTournamentId++;

		this.allTournaments.push(tournament);
		this.storeService.set(`cache.tournaments.${tournament.id}`, tournament);
	}

	/**
	 * Update a tournament
	 *
	 * @param tournament the tournament to update
	 */
	updateTournament(tournament: WyTournament, idToUpdate: number, updateFromPublish?: boolean): void {
		for (const findTournament in this.allTournaments) {
			if (updateFromPublish == true) {
				if (this.allTournaments[findTournament].publishId == idToUpdate) {
					tournament.id = this.allTournaments[findTournament].id;

					this.allTournaments[findTournament] = WyTournament.makeTrueCopy(tournament);
					break;
				}
			}
			else {
				if (this.allTournaments[findTournament].id == idToUpdate) {
					this.allTournaments[findTournament] = WyTournament.makeTrueCopy(tournament);
					break;
				}
			}
		}

		this.storeService.set(`cache.tournaments.${tournament.id}`, tournament);
	}

	/**
	 * Update a published tournament
	 *
	 * @param tournament the tournament to update
	 */
	updatePublishedTournament(tournament: WyTournament): Observable<WyTournament> {
		return this.httpClient.post<WyTournament>(`${this.apiUrl}wyreferee/tournament`, tournament);
	}

	/**
	 * Delete the tournament from the cache and service
	 *
	 * @param tournament the tournament to delete
	 */
	deleteTournament(tournament: WyTournament): void {
		this.allTournaments.splice(this.allTournaments.indexOf(tournament), 1);
		this.storeService.delete(`cache.tournaments.${tournament.id}`);
	}

	/**
	 * Delete the published tournament
	 *
	 * @param tournament the tournament to delete
	 */
	deletePublishedTournament(tournament: WyTournament): Observable<void> {
		return this.httpClient.delete<void>(`${this.apiUrl}wyreferee/tournament/${tournament.id}`);
	}

	/**
	 * Get a tournament by the given id
	 *
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

	/**
	 * Publish a tournament
	 *
	 * @param tournament the tournament to publish
	 */
	publishTournament(tournament: WyTournament): Observable<WyTournament> {
		return this.httpClient.post<WyTournament>(`${this.apiUrl}wyreferee/tournament`, tournament);
	}

	/**
	 * Get all published tournaments
	 */
	getAllPublishedTournaments() {
		return this.httpClient.get<WyTournament[]>(`${this.apiUrl}wyreferee/tournament`);
	}

	/**
	 * Get all published tournaments that you have administrator permissions to
	 */
	getAllPublishedTournamentsWithAdminPermissions() {
		return this.httpClient.get<WyTournament[]>(`${this.apiUrl}wyreferee/tournament/administrator_permission`);
	}

	/**
	 * Get all published tournaments that you have global administrator permissions to
	 */
	getAllPublishedTournamentsWithGlobalAdminPermissions() {
		return this.httpClient.get<WyTournament[]>(`${this.apiUrl}wyreferee/tournament/global_administrator_permission`);
	}

	/**
	 * Get a published tournament by tournament id
	 *
	 * @param tournamentId the id of the tournament that was published
	 */
	getPublishedTournament(tournamentId: number): Observable<WyTournament> {
		return this.httpClient.get<WyTournament>(`${this.apiUrl}wyreferee/tournament/${tournamentId}`);
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
	//  * Get all the published tournaments from the given user
	//  * @param user the user to get all the tournaments from
	//  */
	// getAllPublishedTournamentsFromUser(user: User) {
	// 	return this.httpClient.get<Tournament[]>(`${this.apiUrl}wyreferee/tournament/created_by/${user.id}`);
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

