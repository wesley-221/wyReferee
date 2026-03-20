import { Component, OnInit } from '@angular/core';
import { PersonalSchedule } from 'app/models/wybintournament/personal-schedule';
import { AuthenticateService } from 'app/services/authenticate.service';
import { WybinService } from 'app/services/wybin.service';

@Component({
	selector: 'app-wybin-schedule',
	templateUrl: './wybin-schedule.component.html',
	styleUrl: './wybin-schedule.component.scss'
})
export class WybinScheduleComponent implements OnInit {
	loading: boolean;
	personalScheduleData: PersonalSchedule[];

	constructor(private authService: AuthenticateService, private wyBinService: WybinService) {
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
}
