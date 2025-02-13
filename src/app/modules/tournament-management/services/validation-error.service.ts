import { Injectable } from '@angular/core';
import { ValidationError } from '../models/validation-error';

@Injectable({
	providedIn: 'root'
})
export class ValidationErrorService {
	private validators: ValidationError[];

	constructor() {
		this.validators = [
			new ValidationError('tournament-name', 'You have to fill in the tournament name.'),
			new ValidationError('tournament-acronym', 'You have to fill in the tournament acronym.'),
			new ValidationError('tournament-gamemode', 'You have to select a gamemode.'),
			new ValidationError('tournament-score-system', 'You have to select a score system.'),
			new ValidationError('tournament-protects', 'You have to select whether to use protects.'),
			new ValidationError('tournament-format', 'You have to select the tournament format.'),
			new ValidationError('tournament-team-size', 'You have to set the team size.'),

			new ValidationError('default-team-mode', 'You have to set the team mode for the default multiplayer lobby settings.'),
			new ValidationError('default-win-condition', 'You have to set the win condition for the default multiplayer lobby settings.'),
			new ValidationError('default-players', 'You have to set the players amount for the default multiplayer lobby settings.'),

			new ValidationError('allow-double-pick', 'You have to select whether to allow double picking from a mod bracket.'),
			new ValidationError('invalidate-beatmaps', 'You have to select whether to invalidate beatmaps that are not part of the mappool.'),
			new ValidationError('lobby-team-name-with-brackets', 'You have to select whether to use brackets when creating a lobby.'),

			new ValidationError('tournament-team-name-(\\d+)', 'You have to set the name for the {0} team.'),

			new ValidationError('tournament-stage-name-(\\d+)', 'You have to set the name for the {0} stage.'),
			new ValidationError('tournament-stage-best-of-(\\d+)', 'You have to set the best of for {0} stage.'),
			new ValidationError('tournament-stage-bans-(\\d+)', 'You have to set the amount of bans for {0} stage.'),

			new ValidationError('webhook-(\\d+)-name', 'You have to set the name for the {0} webhook.'),
			new ValidationError('webhook-(\\d+)-url', 'You have to set the URL for the {0} webhook.'),

			new ValidationError('conditional-message-(\\d+)', 'You have to set the message for the {0} conditional message.'),

			new ValidationError('mappool-(\\d+)-name', 'You have to set the name for the {0} mappool.'),
			new ValidationError('mappool-(\\d+)-type', 'You have to set the type for the {0} mappool.'),
			new ValidationError('mappool-(\\d+)-mod-bracket-(\\d+)-name', 'You have to set the name for the {1} mod bracket from the {0} mappool.'),
			new ValidationError('mappool-(\\d+)-mod-bracket-(\\d+)-acronym', 'You have to set the acronym for the {1} mod bracket from the {0} mappool.'),
			new ValidationError('mappool-(\\d+)-mod-bracket-(\\d+)-mod-(\\d+)-value', 'You have to select a mod for the {3} mod dropdown of the {2} mod bracket from the {1} mappool.'),
		];
	}

	/**
	 * Get the error message for the given validator key
	 *
	 * @param validatorKey the key to get the error message for
	 */
	getErrorMessage(validatorKey: string): string {
		for (const validator of this.validators) {
			if (validator.match(validatorKey)) {
				return validator.parseErrorMessage(validatorKey);
			}
		}

		return null;
	}
}
