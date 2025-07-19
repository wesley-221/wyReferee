import { Injectable } from '@angular/core';
import { AppConfig } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, take } from 'rxjs';
import { GenericService } from './generic.service';
import { ToastService } from './toast.service';
import { ToastType } from 'app/models/toast';
import { WyBinStage } from 'app/models/wybintournament/wybin-stage';
import { TournamentStoreService } from './storage/tournament-store.service';

@Injectable({
	providedIn: 'root'
})

export class TournamentService {
	allTournaments: WyTournament[];
	availableTournamentId: number;

	private readonly apiUrl = AppConfig.apiUrl;
	private tournamentsInitialized$: BehaviorSubject<boolean>;

	constructor(private tournamentStoreService: TournamentStoreService, private httpClient: HttpClient, private genericService: GenericService, private toastService: ToastService) {
		this.availableTournamentId = 0;
		this.allTournaments = [];

		this.tournamentsInitialized$ = new BehaviorSubject(false);

		this.loadTournaments(true);
	}

	/**
	 * Load all tournaments from the store and update them if they have been updated
	 *
	 * @param initialLoad if this is the initial load of tournaments
	 */
	loadTournaments(initialLoad: boolean): void {
		this.tournamentStoreService
			.watchTournaments()
			.pipe(take(1))
			.subscribe(tournamentStore => {
				if (tournamentStore) {
					// Only load in tournaments for the initial load
					if (initialLoad == true) {
						const tournaments = Object.values(tournamentStore);
						this.allTournaments = tournaments.map(tournament => WyTournament.makeTrueCopy(tournament));
					}

					// Update tournaments if they have been updated
					for (const tournament of this.allTournaments) {
						if (tournament.publishId != undefined) {
							this.getPublishedTournament(tournament.publishId).subscribe((data) => {
								const publishedTournament: WyTournament = WyTournament.makeTrueCopy(data);

								if (publishedTournament.updateDate.getTime() != tournament.updateDate.getTime()) {
									publishedTournament.publishId = publishedTournament.id;

									this.toastService.addToast(`The tournament "${tournament.name}" has been updated.`, ToastType.Information, 10);

									this.updateTournament(publishedTournament, tournament.publishId, true);
								}
							});
						}
					}

					this.tournamentsInitialized$.next(true);
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
		this.tournamentStoreService.saveTournament(tournament);
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

		this.tournamentStoreService.saveTournament(tournament);
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
		this.tournamentStoreService.deleteTournament(tournament);
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

	/**
	 * Get the mappools from the given wyBin tournament
	 *
	 * @param tournamentId the id of the tournament
	 */
	getWyBinTournamentMappools(tournamentId: number) {
		return this.httpClient.get(`${this.apiUrl}tournament-mappools/${tournamentId}`);
	}

	/**
	 * Get the players from the wyBin tournament
	 *
	 * @param tournamentId the id of the tournament
	 */
	getWyBinTournamentPlayers(tournamentId: number) {
		return this.httpClient.get(`${this.apiUrl}tournament-players/${tournamentId}`);
	}

	/**
	 * Get the teams from the wyBin tournament
	 *
	 * @param tournamentId the id of the tournament
	 */
	getWyBinTournamentTeams(tournamentId: number) {
		return this.httpClient.get(`${this.apiUrl}tournament-teams/${tournamentId}`);
	}

	/**
	 * Get the participants from the given wyBin tournament and qualifier lobby
	 *
	 * @param tournamentId the id of the tournament
	 * @param qualifierIdentifier the identifier of the qualifier lobby
	 */
	getWyBinQualifierLobbyTeams(tournamentId: number, qualifierIdentifier: string) {
		return this.httpClient.get(`${this.apiUrl}tournament-qualifier-lobby-participants/${tournamentId}/${qualifierIdentifier}`);
	}

	/**
	 * Get all wyBin stages from the given tournament
	 *
	 * @param tournamentId the id of the tournament
	 */
	getWyBinStages(tournamentId: number) {
		return this.httpClient.get<WyBinStage[]>(`${this.apiUrl}tournament-stages/${tournamentId}`);
	}
}

