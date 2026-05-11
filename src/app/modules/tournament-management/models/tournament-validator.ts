import { WyTournament } from "../../../models/wytournament/wy-tournament";
import { ValidationErrorMessage } from "./validation-error-message";

export type ValidationSection =
	| 'general'
	| 'wyBin'
	| 'access'
	| 'webhooks'
	| 'triggerMessages'
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
	static validators = [
		// General
		new ValidationErrorMessage(/^name$/, 'You have to fill in the tournament name.'),
		new ValidationErrorMessage(/^acronym$/, 'You have to fill in the tournament acronym.'),
		new ValidationErrorMessage(/^gamemodeId$/, 'You have to select a gamemode.'),
		new ValidationErrorMessage(/^protects$/, 'You have to select whether to use protects.'),
		new ValidationErrorMessage(/^scoreSystem$/, 'You have to select a score system.'),
		new ValidationErrorMessage(/^format$/, 'You have to select the tournament format.'),
		new ValidationErrorMessage(/^teamSize$/, 'You have to set the team size.'),

		new ValidationErrorMessage(/^defaultTeamMode$/, 'You have to set the team mode for the default multiplayer lobby settings.'),
		new ValidationErrorMessage(/^defaultWinCondition$/, 'You have to set the win condition for the default multiplayer lobby settings.'),
		new ValidationErrorMessage(/^defaultPlayers$/, 'You have to set the players amount for the default multiplayer lobby settings.'),

		// Mappools
		new ValidationErrorMessage(/^mappools\[(\d+)\]\.name$/, 'You have to set the name for the {0} mappool.'),
		new ValidationErrorMessage(/^mappools\[(\d+)\]\.modBrackets\[(\d+)\]\.name$/, 'You have to set the name for the {1} mod bracket from the {0} mappool.'),
		new ValidationErrorMessage(/^mappools\[(\d+)\]\.modBrackets\[(\d+)\]\.acronym$/, 'You have to set the acronym for the {1} mod bracket from the {0} mappool.'),
		new ValidationErrorMessage(/^mappools\[(\d+)\]\.modBrackets\[(\d+)\]\.mods\[(\d+)\]\.valueNotUnique$/, 'The {2} mod is a duplicate for the {1} mod bracket from the {0} mappool.'),
		new ValidationErrorMessage(/^mappools\[(\d+)\]\.modBrackets\[(\d+)\]\.mods\[(\d+)\]\.value$/, 'You have to select a mod for the {2} mod dropdown of the {1} mod bracket from the {0} mappool.'),

		// Teams
		new ValidationErrorMessage(/^teams\[(\d+)\]\.name$/, 'You have to set the name for the {0} team.'),
		new ValidationErrorMessage(/^teams\[(\d+)\]\.players\[(\d+)\]\.name$/, 'You have to set the name for the {1} player of the {0} team.'),

		// Stages
		new ValidationErrorMessage(/^stages\[(\d+)\]\.name$/, 'You have to set the name for the {0} stage.'),
		new ValidationErrorMessage(/^stages\[(\d+)\]\.bestOf$/, 'You have to set the best of for {0} stage.'),

		// Webhooks
		new ValidationErrorMessage(/^webhooks\[(\d+)\]\.name$/, 'You have to set the name for the {0} webhook.'),
		new ValidationErrorMessage(/^webhooks\[(\d+)\]\.url$/, 'You have to set the URL for the {0} webhook.'),

		// Trigger messages
		new ValidationErrorMessage(/^triggerMessages\[(\d+)\]\.message$/, 'You have to set the message for the {0} trigger message.')
	];

	static validateTournament(tournament: WyTournament): ValidationResult {
		const errors = [
			...this.validateGeneral(tournament).errors,
			...this.validateMappools(tournament).errors,
			...this.validateParticipants(tournament).errors,
			...this.validateStages(tournament).errors,
			...this.validateWebhooks(tournament).errors,
			...this.validateTriggerMessages(tournament).errors
		];

		return result(errors);
	}

	static validateGeneral(tournament: WyTournament): ValidationResult {
		const errors: ValidationError[] = [];

		if (!tournament.name) {
			errors.push({
				section: 'general',
				path: 'name',
				message: this.getErrorMessage('name'),
				code: 'REQUIRED'
			});
		}

		if (!tournament.acronym) {
			errors.push({
				section: 'general',
				path: 'acronym',
				message: this.getErrorMessage('acronym'),
				code: 'REQUIRED'
			});
		}

		if (tournament.gamemodeId == null) {
			errors.push({
				section: 'general',
				path: 'gamemodeId',
				message: this.getErrorMessage('gamemodeId'),
				code: 'REQUIRED'
			});
		}

		if (tournament.protects == null) {
			errors.push({
				section: 'general',
				path: 'protects',
				message: this.getErrorMessage('protects'),
				code: 'REQUIRED'
			});
		}

		if (!tournament.scoreInterfaceIdentifier) {
			errors.push({
				section: 'general',
				path: 'scoreSystem',
				message: this.getErrorMessage('scoreSystem'),
				code: 'REQUIRED'
			});
		}

		if (!tournament.format) {
			errors.push({
				section: 'general',
				path: 'format',
				message: this.getErrorMessage('format'),
				code: 'REQUIRED'
			});
		}

		if (!tournament.teamSize) {
			errors.push({
				section: 'general',
				path: 'teamSize',
				message: this.getErrorMessage('teamSize'),
				code: 'REQUIRED'
			});
		}

		if (tournament.defaultTeamMode == null) {
			errors.push({
				section: 'general',
				path: 'defaultTeamMode',
				message: this.getErrorMessage('defaultTeamMode'),
				code: 'REQUIRED'
			});
		}

		if (tournament.defaultWinCondition == null) {
			errors.push({
				section: 'general',
				path: 'defaultWinCondition',
				message: this.getErrorMessage('defaultWinCondition'),
				code: 'REQUIRED'
			});
		}

		if (tournament.defaultPlayers == null) {
			errors.push({
				section: 'general',
				path: 'defaultPlayers',
				message: this.getErrorMessage('defaultPlayers'),
				code: 'REQUIRED'
			});
		}

		return result(errors);
	}

	static validateMappools(tournament: WyTournament): ValidationResult {
		const errors: ValidationError[] = [];

		tournament.mappools.forEach((mappool, i) => {
			const base = `mappools[${i}]`;

			if (mappool.name == null || mappool.name.trim() == '') {
				errors.push({
					section: 'mappools',
					path: `${base}.name`,
					message: this.getErrorMessage(`${base}.name`),
					code: 'REQUIRED'
				});
			}

			mappool.modBrackets?.forEach((modBracket, bi) => {
				const bPath = `${base}.modBrackets[${bi}]`;

				if (modBracket.name == null || modBracket.name.trim() == '') {
					errors.push({
						section: 'mappools',
						path: `${bPath}.name`,
						message: this.getErrorMessage(`${bPath}.name`),
						code: 'REQUIRED'
					});
				}

				if (modBracket.acronym == null || modBracket.acronym.trim() == '') {
					errors.push({
						section: 'mappools',
						path: `${bPath}.acronym`,
						message: this.getErrorMessage(`${bPath}.acronym`),
						code: 'REQUIRED'
					});
				}

				modBracket.mods?.forEach((mod, mi) => {
					const mPath = `${bPath}.mods[${mi}]`;

					if (mod.value == null) {
						errors.push({
							section: 'mappools',
							path: `${mPath}.value`,
							message: this.getErrorMessage(`${mPath}.value`),
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
							message: this.getErrorMessage(`${bmPath}.beatmapId`),
							code: 'REQUIRED'
						});
					}

					if (!beatmap.beatmapsetId) {
						errors.push({
							section: 'mappools',
							path: `${bmPath}.beatmapsetId`,
							message: this.getErrorMessage(`${bmPath}.beatmapsetId`),
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

		tournament.teams.forEach((team, ti) => {
			const base = `teams[${ti}]`;

			if (!team.name) {
				errors.push({
					section: 'participants',
					path: `${base}.name`,
					message: this.getErrorMessage(`${base}.name`),
					code: 'REQUIRED'
				});
			}

			team.players?.forEach((player, pi) => {
				if (!player.name) {
					errors.push({
						section: 'participants',
						path: `${base}.players[${pi}].name`,
						message: this.getErrorMessage(`${base}.players[${pi}].name`),
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
					message: this.getErrorMessage(`${base}.name`),
					code: 'REQUIRED'
				});
			}

			if (stage.bestOf == null) {
				errors.push({
					section: 'stages',
					path: `${base}.bestOf`,
					message: this.getErrorMessage(`${base}.bestOf`),
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
					message: this.getErrorMessage(`${base}.name`),
					code: 'REQUIRED'
				});
			}

			if (!webhook.url) {
				errors.push({
					section: 'webhooks',
					path: `${base}.url`,
					message: this.getErrorMessage(`${base}.url`),
					code: 'REQUIRED'
				});
			}
		});

		return result(errors);
	}

	static validateTriggerMessages(tournament: WyTournament): ValidationResult {
		const errors: ValidationError[] = [];

		tournament.triggerMessages?.forEach((triggerMessage, i) => {
			const base = `triggerMessages[${i}]`;

			if (!triggerMessage.message) {
				errors.push({
					section: 'triggerMessages',
					path: `${base}.message`,
					message: this.getErrorMessage(`${base}.message`),
					code: 'REQUIRED'
				});
			}
		});

		return result(errors);
	}

	/**
	 * Get the error message for the given validator key
	 *
	 * @param validatorKey the key to get the error message for
	 */
	static getErrorMessage(validatorKey: string): string {
		for (const validator of this.validators) {
			if (validator.validationRegex.test(validatorKey)) {
				return validator.parseErrorMessage(validatorKey);
			}
		}
		return null;
	}
}
