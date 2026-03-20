import { Injectable } from "@angular/core";
import { WyBinTournament } from "app/models/wybintournament/wybin-tournament";
import { WyBinMatch } from "app/models/wybintournament/wybin-match";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class LobbyCreationContextService {
	tournament: WyBinTournament;
	match: WyBinMatch;

	stagesLoaded$: BehaviorSubject<boolean>;

	constructor() {
		this.stagesLoaded$ = new BehaviorSubject<boolean>(false);

		this.clear();
	}

	/**
	 * Clears the current context
	 */
	clear() {
		this.tournament = null;
		this.match = null;
		this.stagesLoaded$.next(false);
	}

	/**
	 * Sets the tournament and match in the context, which will be used in the lobby creation process.
	 * This allows the lobby creation component to access the tournament and match information.
	 *
	 * @param tournament the tournament to set in the context
	 * @param match the match to set in the context
	 */
	setContext(tournament: WyBinTournament, match: WyBinMatch) {
		this.tournament = tournament;
		this.match = match;
	}

	/**
	 * Gets the current tournament and match in the context.
	 *
	 * @returns the current tournament and match in the context
	 */
	getContext(): { tournament: WyBinTournament, match: WyBinMatch } {
		return {
			tournament: this.tournament,
			match: this.match
		};
	}

	/**
	 * Set whether the stages have loaded, which helps to figure out when you can change the selected stage during lobby creation
	 *
	 * @param loaded whether the stages have loaded
	 */
	setStagesLoadedObservable(loaded: boolean) {
		this.stagesLoaded$.next(loaded);
	}

	/**
	 * Gets an observable that emits whether the stages have loaded
	 */
	getStagesLoadedObservable() {
		return this.stagesLoaded$.asObservable();
	}
}
