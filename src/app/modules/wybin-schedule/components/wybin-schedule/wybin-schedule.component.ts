import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonalSchedule } from 'app/models/wybintournament/personal-schedule';
import { WyBinMatch } from 'app/models/wybintournament/wybin-match';
import { WyBinTournament } from 'app/models/wybintournament/wybin-tournament';
import { AuthenticateService } from 'app/services/authenticate.service';
import { LobbyCreationContextService } from 'app/services/lobby-creation-context.service';
import { WybinService } from 'app/services/wybin.service';

@Component({
	selector: 'app-wybin-schedule',
	templateUrl: './wybin-schedule.component.html',
	styleUrl: './wybin-schedule.component.scss'
})
export class WybinScheduleComponent implements OnInit {
	loading: boolean;
	personalScheduleData: PersonalSchedule[];

	constructor(private authService: AuthenticateService, private wyBinService: WybinService, private lobbyCreationContextService: LobbyCreationContextService, private router: Router) {
		this.loading = true;
	}

	ngOnInit() {
		this.authService.userLoggedIn().subscribe(loggedIn => {
			if (loggedIn == true) {
				this.wyBinService.getPersonalSchedule().subscribe(schedule => {
					this.personalScheduleData = schedule.map(schedule => {
						const newSchedule = PersonalSchedule.makeTrueCopy(schedule);
						const timeRegex = /(\d+):?(\d+)?/;

						newSchedule.matches.sort((a, b) => {
							const firstDate = new Date(a.date);
							const secondDate = new Date(b.date);

							const firstTimeRegex = a.time.trim().match(timeRegex);
							const secondTimeRegex = b.time.trim().match(timeRegex);

							const firstTime = {
								hours: parseInt(firstTimeRegex[1]),
								minutes: isNaN(parseInt(firstTimeRegex[2])) ? 0 : parseInt(firstTimeRegex[2])
							};

							const secondTime = {
								hours: parseInt(secondTimeRegex[1]),
								minutes: isNaN(parseInt(secondTimeRegex[2])) ? 0 : parseInt(secondTimeRegex[2])
							};

							firstDate.setHours(firstTime.hours, firstTime.minutes);
							secondDate.setHours(secondTime.hours, secondTime.minutes);

							return secondDate.getTime() - firstDate.getTime();
						});

						return newSchedule;
					});

					this.loading = false;
				});
			}
		});
	}

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
}
