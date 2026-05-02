import { WyTournament } from "../../../models/wytournament/wy-tournament";

export type ValidationSection =
	| 'general'
	| 'wyBin'
	| 'access'
	| 'webhooks'
	| 'conditionalMessages'
	| 'stages'
	| 'participants'
	| 'mappools';

export interface ValidationError {
	section: ValidationSection;
	path: string;
	message: string;
	code?: string;
}

export interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
}

function result(errors: ValidationError[]): ValidationResult {
	return {
		valid: errors.length === 0,
		errors
	};
}

export class TournamentValidator {
	static validateTournament(tournament: WyTournament): ValidationResult {
		if (!tournament) {
			return result([{
				section: 'general',
				path: '',
				message: 'Tournament is null',
				code: 'NULL'
			}]);
		}

		const errors = [
			...this.validateGeneral(tournament).errors,
			...this.validateMappools(tournament).errors,
			...this.validateParticipants(tournament).errors,
			...this.validateStages(tournament).errors,
			...this.validateWebhooks(tournament).errors,
			...this.validateConditionalMessages(tournament).errors
		];

		return result(errors);
	}

	static validateGeneral(tournament: WyTournament): ValidationResult {
		const errors: ValidationError[] = [];

		if (!tournament.name) {
			errors.push({
				section: 'general',
				path: 'name',
				message: 'Name is required',
				code: 'REQUIRED'
			});
		}

		if (!tournament.acronym) {
			errors.push({
				section: 'general',
				path: 'acronym',
				message: 'Acronym is required',
				code: 'REQUIRED'
			});
		}

		if (tournament.gamemodeId == null) {
			errors.push({
				section: 'general',
				path: 'gamemodeId',
				message: 'Gamemode is required',
				code: 'REQUIRED'
			});
		}

		return result(errors);
	}

	static validateMappools(tournament: WyTournament): ValidationResult {
		const errors: ValidationError[] = [];

		if (!tournament.mappools || tournament.mappools.length === 0) {
			errors.push({
				section: 'mappools',
				path: 'mappools',
				message: 'At least one mappool is required',
				code: 'MIN_LENGTH'
			});
			return result(errors);
		}

		tournament.mappools.forEach((mappool, i) => {
			const base = `mappools[${i}]`;

			if (!mappool.name) {
				errors.push({
					section: 'mappools',
					path: `${base}.name`,
					message: 'Name is required',
					code: 'REQUIRED'
				});
			}

			mappool.modBrackets?.forEach((modBracket, bi) => {
				const bPath = `${base}.modBrackets[${bi}]`;

				if (!modBracket.name) {
					errors.push({
						section: 'mappools',
						path: `${bPath}.name`,
						message: 'Name is required',
						code: 'REQUIRED'
					});
				}

				if (!modBracket.acronym) {
					errors.push({
						section: 'mappools',
						path: `${bPath}.acronym`,
						message: 'Acronym is required',
						code: 'REQUIRED'
					});
				}

				modBracket.mods?.forEach((mod, mi) => {
					const mPath = `${bPath}.mods[${mi}]`;

					if (!mod.name) {
						errors.push({
							section: 'mappools',
							path: `${mPath}.name`,
							message: 'Name is required',
							code: 'REQUIRED'
						});
					}

					if (mod.value == null) {
						errors.push({
							section: 'mappools',
							path: `${mPath}.value`,
							message: 'Value is required',
							code: 'REQUIRED'
						});
					}
				});

				modBracket.beatmaps?.forEach((beatmap, bmi) => {
					const bmPath = `${bPath}.beatmaps[${bmi}]`;

					if (!beatmap.beatmapId) {
						errors.push({
							section: 'mappools',
							path: `${bmPath}.beatmapId`,
							message: 'BeatmapId is required',
							code: 'REQUIRED'
						});
					}

					if (!beatmap.beatmapsetId) {
						errors.push({
							section: 'mappools',
							path: `${bmPath}.beatmapsetId`,
							message: 'BeatmapsetId is required',
							code: 'REQUIRED'
						});
					}
				});
			});
		});

		return result(errors);
	}

	static validateParticipants(tournament: WyTournament): ValidationResult {
		const errors: ValidationError[] = [];

		if (!tournament.teams || tournament.teams.length === 0) {
			errors.push({
				section: 'participants',
				path: 'teams',
				message: 'At least one participant is required',
				code: 'MIN_LENGTH'
			});
			return result(errors);
		}

		tournament.teams.forEach((team, ti) => {
			const base = `teams[${ti}]`;

			if (!team.name) {
				errors.push({
					section: 'participants',
					path: `${base}.name`,
					message: 'Team name is required',
					code: 'REQUIRED'
				});
			}

			team.players?.forEach((player, pi) => {
				if (!player.userId) {
					errors.push({
						section: 'participants',
						path: `${base}.players[${pi}].userId`,
						message: 'User is required',
						code: 'REQUIRED'
					});
				}
			});
		});

		return result(errors);
	}

	static validateStages(tournament: WyTournament): ValidationResult {
		const errors: ValidationError[] = [];

		tournament.stages?.forEach((stage, si) => {
			const base = `stages[${si}]`;

			if (!stage.name) {
				errors.push({
					section: 'stages',
					path: `${base}.name`,
					message: 'Name is required',
					code: 'REQUIRED'
				});
			}
		});

		return result(errors);
	}

	static validateWebhooks(tournament: WyTournament): ValidationResult {
		const errors: ValidationError[] = [];

		tournament.webhooks?.forEach((webhook, i) => {
			const base = `webhooks[${i}]`;

			if (!webhook.name) {
				errors.push({
					section: 'webhooks',
					path: `${base}.name`,
					message: 'Name is required',
					code: 'REQUIRED'
				});
			}

			if (!webhook.url) {
				errors.push({
					section: 'webhooks',
					path: `${base}.url`,
					message: 'URL is required',
					code: 'REQUIRED'
				});
			}
		});

		return result(errors);
	}

	static validateConditionalMessages(tournament: WyTournament): ValidationResult {
		const errors: ValidationError[] = [];

		tournament.conditionalMessages?.forEach((conditionalMessage, i) => {
			if (!conditionalMessage.message) {
				errors.push({
					section: 'conditionalMessages',
					path: `conditionalMessages[${i}].message`,
					message: 'Message is required',
					code: 'REQUIRED'
				});
			}
		});

		return result(errors);
	}
}
