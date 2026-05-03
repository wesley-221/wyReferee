import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, shareReplay } from 'rxjs';
import { WyTournament } from '../../../models/wytournament/wy-tournament';
import { TournamentGeneralForm } from '../interfaces/tournament-general-form.interface';
import { TournamentWybinForm } from '../interfaces/tournament-wybin-form.interface';
import { TournamentAccessState } from '../interfaces/tournament-access-state.interface';
import { TournamentWebhookForm } from '../interfaces/tournament-webhook-form.interface';
import { WyWebhook } from '../../../models/wytournament/wy-webhook';
import { TournamentTriggerMessageForm } from '../interfaces/tournament-trigger-messages-form.interface';
import { WyTriggerMessage } from '../../../models/wytournament/trigger-message';
import { TournamentStageForm } from '../interfaces/tournament-stage-form.interface';
import { WyStage } from '../../../models/wytournament/wy-stage';
import { TournamentPlayerForm } from '../interfaces/tournament-player-form.interface';
import { TournamentTeamForm } from '../interfaces/tournament-team-form.interface';
import { WyTeam } from '../../../models/wytournament/wy-team';
import { WyTeamPlayer } from '../../../models/wytournament/wy-team-player';
import { TournamentMappoolForm } from '../interfaces/tournament-mappool-form.interface';
import { WyMappool } from '../../../models/wytournament/mappool/wy-mappool';
import { WyModBracket } from '../../../models/wytournament/mappool/wy-mod-bracket';
import { WyMod } from '../../../models/wytournament/mappool/wy-mod';
import { WyModBracketMap } from '../../../models/wytournament/mappool/wy-mod-bracket-map';
import { WyModCategory } from '../../../models/wytournament/mappool/wy-mod-category';
import { Calculate } from '../../../models/score-calculation/calculate';
import { TournamentValidator, ValidationError, ValidationSection } from '../models/tournament-validator';

export type PageSectionState = {
	valid: boolean;
	errorCount: number;
};

export type PageState = {
	general: PageSectionState;
	wyBin: PageSectionState;
	access: PageSectionState;
	webhooks: PageSectionState;
	triggerMessages: PageSectionState;
	stages: PageSectionState;
	participants: PageSectionState;
	mappools: PageSectionState;
	errors: Record<ValidationSection, ValidationError[]>;
	totalErrorCount: number;
};

@Injectable({
	providedIn: 'root'
})
export class TournamentEditStateService {
	private draft$ = new BehaviorSubject<WyTournament>(null);
	private calculateScoreInterfaces = new Calculate();

	pageState$ = this.draft$.pipe(
		filter((draft): draft is WyTournament => !!draft),
		map(draft => this.buildPageState(draft)),
		shareReplay(1)
	);

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
		updatedDraft.scoreInterface = this.calculateScoreInterfaces.getScoreInterface(general.scoreSystem);
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
				id: webhook.id,
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

	updateTriggerMessagesForm(triggerMessages: TournamentTriggerMessageForm[]) {
		const currentDraft = this.draft$.getValue();

		if (!currentDraft) {
			return;
		}

		const updatedDraft = this.getCurrent();

		updatedDraft.triggerMessages = triggerMessages.map(tm =>
			new WyTriggerMessage({
				id: tm.id,
				message: tm.message,
				beatmapResult: tm.beatmapResult,
				beatmapPicked: tm.beatmapPicked,
				nextPickMessage: tm.nextPickMessage,
				nextPickTiebreakerMessage: tm.nextPickTiebreakerMessage,
				matchWonMessage: tm.matchWonMessage
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
				id: stage.id,
				wyBinStageId: stage.wyBinStageId,
				name: stage.name,
				bestOf: stage.bestOf,
				bans: stage.bans,
				hitpoints: stage.hitpoints
			})
		);

		this.draft$.next(updatedDraft);
	}

	updatePlayersForm(players: TournamentPlayerForm[]) {
		const currentDraft = this.draft$.getValue();

		if (!currentDraft) {
			return;
		}

		const updatedDraft = this.getCurrent();

		updatedDraft.teams = players.map(player => (
			new WyTeam({
				id: player.id,
				name: player.name,
				userId: player.userId
			})
		));

		this.draft$.next(updatedDraft);
	}

	updateTeamsForm(teams: TournamentTeamForm[]) {
		const currentDraft = this.draft$.getValue();

		if (!currentDraft) {
			return;
		}

		const updatedDraft = this.getCurrent();

		updatedDraft.teams = teams.map(team => (
			new WyTeam({
				id: team.id,
				name: team.name,
				players: team.players.map(player => new WyTeamPlayer({
					id: player.id,
					name: player.name,
					userId: player.userId
				}))
			})
		));

		this.draft$.next(updatedDraft);
	}

	updateMappoolForm(mappools: TournamentMappoolForm[]) {
		const currentDraft = this.draft$.getValue();

		if (!currentDraft) {
			return;
		}

		const updatedDraft = this.getCurrent();

		updatedDraft.mappools = mappools.map(mappool => (
			new WyMappool({
				id: mappool.id,
				name: mappool.name,
				type: mappool.type,
				gamemodeId: mappool.gamemodeId,
				modBrackets: mappool.modBrackets.map(modBracket => (
					new WyModBracket({
						id: modBracket.id,
						name: modBracket.name,
						acronym: modBracket.acronym,
						mods: modBracket.mods.map(mod => new WyMod({
							id: mod.id,
							name: mod.name,
							value: mod.value
						})),
						beatmaps: modBracket.beatmaps.map(beatmap => new WyModBracketMap({
							id: beatmap.id,
							invalid: beatmap.invalid,
							beatmapId: beatmap.beatmapId,
							beatmapsetId: beatmap.beatmapsetId,
							beatmapName: beatmap.beatmapName,
							beatmapUrl: beatmap.beatmapUrl,
							modifier: beatmap.modifier,
							damageAmount: beatmap.damageAmount,
							modCategory: beatmap.modCategory,
							gamemodeId: beatmap.gamemodeId,
							reverseScore: beatmap.reverseScore,
							picked: beatmap.picked,
							isSynchronizing: beatmap.isSynchronizing
						}))
					})
				)),
				modCategories: mappool.modCategories.map(modCategory => new WyModCategory({
					id: modCategory.id,
					name: modCategory.name,
				}))
			})
		));

		this.draft$.next(updatedDraft);
	}

	private buildPageState(draft: WyTournament): PageState {
		const validation = TournamentValidator.validateTournament(draft);

		const groupedErrors = validation.errors.reduce((acc, error) => {
			if (!acc[error.section]) {
				acc[error.section] = [];
			}

			acc[error.section].push(error);

			return acc;
		}, {} as Record<ValidationSection, ValidationError[]>);

		const count = (section: ValidationSection) =>
			groupedErrors[section]?.length ?? 0;

		const buildSection = (section: ValidationSection): PageSectionState => {
			const errorCount = count(section);

			return {
				valid: errorCount === 0,
				errorCount
			};
		};

		return {
			general: buildSection('general'),
			wyBin: buildSection('wyBin'),
			access: buildSection('access'),
			webhooks: buildSection('webhooks'),
			triggerMessages: buildSection('triggerMessages'),
			stages: buildSection('stages'),
			participants: buildSection('participants'),
			mappools: buildSection('mappools'),
			errors: groupedErrors,
			totalErrorCount: validation.errors.length
		};
	}
}
