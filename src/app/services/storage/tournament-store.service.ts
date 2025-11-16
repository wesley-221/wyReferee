import { Injectable } from '@angular/core';
import { StorageDriverService } from './storage-driver.service';
import { BehaviorSubject } from 'rxjs';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

interface TournamentStore {
	[tournamentSlug: string]: WyTournament;
}

@Injectable({
	providedIn: 'root'
})
export class TournamentStoreService {
	private tournaments$ = new BehaviorSubject<TournamentStore | null>(null);

	constructor(private storage: StorageDriverService) {
		this.loadTournaments();
	}

	/**
	 * Saves a tournament
	 *
	 * @param tournament the tournament to save
	 */
	async saveTournament(tournament: WyTournament) {
		const current = this.tournaments$.value;

		if (!current) throw new Error('Tournaments not loaded yet');

		const newTournaments = { ...current, [tournament.getSlug()]: tournament };
		this.tournaments$.next(newTournaments);

		const filePath = await this.storage.joinPath(this.storage.tournamentPath, `${tournament.getSlug()}.json`);
		this.storage.writeJSON(filePath, tournament);
	}

	/**
	 * Deletes a tournament
	 *
	 * @param tournament the tournament to delete
	 */
	async deleteTournament(tournament: WyTournament) {
		const current = this.tournaments$.value;

		if (!current) throw new Error('Tournaments not loaded yet');

		const { [tournament.getSlug()]: _, ...newTournaments } = current;
		this.tournaments$.next(newTournaments);

		const filePath = await this.storage.joinPath(this.storage.tournamentPath, `${tournament.getSlug()}.json`);
		this.storage.deleteFile(filePath);
	}

	/**
	 * Returns an observable that emits all tournaments
	 */
	watchTournaments() {
		return this.tournaments$;
	}

	/**
	 * Loads all tournaments from storage and initializes the BehaviorSubject
	 */
	private async loadTournaments() {
		const tournamentFiles = await this.storage.listFiles(this.storage.tournamentPath);

		const tournaments: TournamentStore = {};

		for (const file of tournamentFiles) {
			if (file.endsWith('.json')) {
				const filePath = await this.storage.joinPath(this.storage.tournamentPath, file);
				const tournament = await this.storage.readJSON<WyTournament>(filePath);

				if (tournament) {
					const tournamentObject = WyTournament.makeTrueCopy(tournament);
					tournaments[tournamentObject.getSlug()] = tournamentObject;
				}
			}
		}

		this.tournaments$.next(tournaments);
	}
}
