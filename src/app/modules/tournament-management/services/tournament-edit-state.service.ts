import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WyTournament } from '../../../models/wytournament/wy-tournament';
import { TournamentGeneralForm } from '../interfaces/tournament-general-form.interface';
import { TournamentWybinForm } from '../interfaces/tournament-wybin-form.interface';
import { TournamentAccessState } from '../interfaces/tournament-access-state.interface';
import { TournamentWebhookForm } from '../interfaces/tournament-webhook-form.interface';
import { WyWebhook } from '../../../models/wytournament/wy-webhook';
import { TournamentConditionalMessageForm } from '../interfaces/tournament-conditional-messages-form.interface';
import { WyConditionalMessage } from '../../../models/wytournament/wy-conditional-message';
import { TournamentStageForm } from '../interfaces/tournament-stage-form.interface';
import { WyStage } from '../../../models/wytournament/wy-stage';

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

	updateAccessState(access: TournamentAccessState) {
		const currentDraft = this.draft$.getValue();

		if (!currentDraft) {
			return;
		}

		const updatedDraft = this.getCurrent();

		updatedDraft.administrators = access.administrators;
		updatedDraft.availableTo = access.availableTo;

		this.draft$.next(updatedDraft);
	}

	updateWebhooksForm(webhooks: TournamentWebhookForm[]) {
		const currentDraft = this.draft$.getValue();

		if (!currentDraft) {
			return;
		}

		const updatedDraft = this.getCurrent();

		updatedDraft.webhooks = webhooks.map(webhook =>
			new WyWebhook({
				name: webhook.name,
				url: webhook.url,
				matchCreation: webhook.matchCreation,
				picks: webhook.picks,
				bans: webhook.bans,
				matchSummary: webhook.matchSummary,
				matchResult: webhook.matchResult,
				finalResult: webhook.finalResult
			})
		);

		this.draft$.next(updatedDraft);
	}

	updateConditionalMessagesForm(conditionalMessages: TournamentConditionalMessageForm[]) {
		const currentDraft = this.draft$.getValue();

		if (!currentDraft) {
			return;
		}

		const updatedDraft = this.getCurrent();

		updatedDraft.conditionalMessages = conditionalMessages.map(cm =>
			new WyConditionalMessage({
				message: cm.message,
				beatmapResult: cm.beatmapResult,
				beatmapPicked: cm.beatmapPicked,
				nextPickMessage: cm.nextPickMessage,
				nextPickTiebreakerMessage: cm.nextPickTiebreakerMessage,
				matchWonMessage: cm.matchWonMessage
			})
		);

		this.draft$.next(updatedDraft);
	}

	updateStagesForm(stages: TournamentStageForm[]) {
		const currentDraft = this.draft$.getValue();

		if (!currentDraft) {
			return;
		}

		const updatedDraft = this.getCurrent();

		updatedDraft.stages = stages.map(stage =>
			new WyStage({
				name: stage.name,
				bestOf: stage.bestOf,
				bans: stage.bans,
				hitpoints: stage.hitpoints
			})
		);

		this.draft$.next(updatedDraft);
	}
}
