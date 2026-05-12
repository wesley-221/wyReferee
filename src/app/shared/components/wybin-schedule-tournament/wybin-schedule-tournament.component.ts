import { Component, Input } from '@angular/core';
import { PersonalSchedule } from '../../../models/wybintournament/personal-schedule';
import { WyBinTournament } from '../../../models/wybintournament/wybin-tournament';
import { WyBinMatch } from '../../../models/wybintournament/wybin-match';
import { Router } from '@angular/router';
import { LobbyCreationContextService } from '../../../services/lobby-creation-context.service';

@Component({
	selector: 'app-wybin-schedule-tournament',
	templateUrl: './wybin-schedule-tournament.component.html',
	styleUrl: './wybin-schedule-tournament.component.scss'
})
export class WybinScheduleTournamentComponent {
	@Input() personalSchedule: PersonalSchedule;

	constructor(
		private lobbyCreationContextService: LobbyCreationContextService,
		private router: Router
	) { }

	/**
	 * Creates the selected lobby and navigates to the lobby creation page
	 *
	 * @param tournament the tournament the match belongs to
	 * @param match the match to create a lobby for
	 */
	createMatch(tournament: WyBinTournament, match: WyBinMatch) {
		this.lobbyCreationContextService.setContext(tournament, match);
		this.router.navigate(['lobby-overview', 'create-lobby']);
	}

	/**
	 * Calculates the time until the match starts and returns it as a string
	 *
	 * @param match the match to calculate the time until it starts for
	 */
	getDayAndHoursUntilMatch(match: WyBinMatch): string {
		const matchDate = new Date(match.date);
		const currentDate = new Date();

		const timeRegex = /(\d+):?(\d+)?/;
		const matchTimeRegex = match.time.trim().match(timeRegex);

		matchDate.setHours(parseInt(matchTimeRegex[1]), isNaN(parseInt(matchTimeRegex[2])) ? 0 : parseInt(matchTimeRegex[2]));

		const timeDifference = matchDate.getTime() - currentDate.getTime();

		if (timeDifference <= 0) {
			return 'Match has already started';
		}

		const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
		const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

		let result = 'in ';

		if (days > 0) {
			result += `${days} day${days > 1 ? 's' : ''}`;
		}

		if (hours > 0) {
			if (days > 0) {
				result += ' and ';
			}

			result += `${hours} hour${hours > 1 ? 's' : ''}`;
		}

		if (minutes > 0 && days === 0 && hours === 0) {
			if (days > 0 || hours > 0) {
				result += ' and ';
			}

			result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
		}

		return result.length > 0 ? result : 'less than an hour';
	}
}
