import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WyTournament } from '../../../models/wytournament/wy-tournament';
import { TournamentGeneralForm } from '../interfaces/tournament-general-form.interface';
import { TournamentWybinForm } from '../interfaces/tournament-wybin-form.interface';

@Injectable({
	providedIn: 'root'
})
export class TournamentEditStateService {
	private draft$ = new BehaviorSubject<WyTournament>(null);

	setInitialTournament(tournament: WyTournament) {
		this.draft$.next(tournament);
	}

	getDraft$(): Observable<WyTournament> {
		return this.draft$.asObservable();
	}

	getCurrent(): WyTournament {
		return this.draft$.getValue();
	}

	updateGeneralForm(general: TournamentGeneralForm) {
		const currentDraft = this.draft$.getValue();

		if (!currentDraft) {
			return;
		}

		const updatedDraft = this.getCurrent();

		updatedDraft.name = general.name;
		updatedDraft.acronym = general.acronym;
		updatedDraft.gamemodeId = general.gamemode;
		updatedDraft.scoreInterfaceIdentifier = general.scoreSystem;
		updatedDraft.protects = general.protects;
		updatedDraft.format = general.format;
		updatedDraft.teamSize = general.teamSize;
		updatedDraft.defaultTeamMode = general.defaultTeamMode;
		updatedDraft.defaultWinCondition = general.defaultWinCondition;
		updatedDraft.defaultPlayers = general.defaultPlayers;
		updatedDraft.allowDoublePick = general.allowDoublePick;
		updatedDraft.invalidateBeatmaps = general.invalidateBeatmaps;
		updatedDraft.lobbyTeamNameWithBrackets = general.lobbyTeamNameWithBrackets;
		updatedDraft.addrefUsernames = general.addrefUsernames;

		this.draft$.next(updatedDraft);
	}

	updateWyBinForm(wyBin: TournamentWybinForm) {
		const currentDraft = this.draft$.getValue();

		if (!currentDraft) {
			return;
		}

		const updatedDraft = this.getCurrent();

		updatedDraft.wyBinTournamentId = wyBin.wyBinTournamentId;

		this.draft$.next(updatedDraft);
	}
}
