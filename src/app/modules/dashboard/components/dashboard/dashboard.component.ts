import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'app/services/electron.service';
import { AppConfig } from 'environments/environment';
import { PersonalSchedule } from '../../../../models/wybintournament/personal-schedule';
import { AuthenticateService } from '../../../../services/authenticate.service';
import { WybinService } from '../../../../services/wybin.service';
import { take } from 'rxjs';
import { WyRefereeNotificationsService } from '../../../../services/wyreferee-notifications.service';
import { SettingsStoreService } from '../../../../services/storage/settings-store.service';
import { WyRefereeNotification } from '../../../../models/wyreferee-notification';
import PackageJson from '../../../../../../package.json';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	discordServerLink = AppConfig.links.discordServer;
	githubIssuesLink = AppConfig.links.githubIssues;
	githubWikiLink = AppConfig.links.githubWiki;

	gettingStartedItems = [
		{ title: 'Login', description: 'Connect your osu! account to get started.', 'link-label': 'account', 'link': '/account' },
		{ title: 'Set up Discord webhooks', description: 'Customize how the Discord webhook looks when a match update is being sent.', 'link-label': 'webhooks', 'link': '/settings' },
		{ title: 'Import or create a tournament', description: 'Import an existing tournament or create a new one to manage.', 'link-label': 'tournaments', 'link': '/tournament-management' },
		{ title: 'Create a lobby', description: 'Start refereeing - the IRC view handles the rest', 'link-label': 'lobby', 'link': '/lobby-overview' }
	];

	resources = [
		{ title: 'Discord server', description: 'Ask questions, get help', link: this.discordServerLink },
		{ title: 'GitHub issues', description: 'Report bugs, request features', link: this.githubIssuesLink },
		{ title: 'Wiki', description: 'Read documentation, find guides', link: this.githubWikiLink }
	]

	loading: boolean;
	personalScheduleData: PersonalSchedule[];

	notifications: WyRefereeNotification[] = [];

	private currentVersion = PackageJson.version;

	constructor(
		public electronService: ElectronService,
		private authService: AuthenticateService,
		private wyBinService: WybinService,
		private notificationService: WyRefereeNotificationsService,
		private settingsStore: SettingsStoreService
	) {
		this.loading = true;

		const notificationDismissed = this.settingsStore.get(`notification-${this.currentVersion}-dismissed`);

		if (!notificationDismissed) {
			this.notificationService.getNotifications(this.currentVersion).subscribe(notifications => {
				if (notifications.length > 0) {
					this.notifications = notifications;
				}
			});
		}
	}

	ngOnInit() {
		this.authService.userLoggedIn().subscribe(loggedIn => {
			if (loggedIn == true) {
				this.wyBinService.getPersonalSchedule()
					.pipe(
						take(1)
					)
					.subscribe({
						next: (schedule: PersonalSchedule[]) => {
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

									return firstDate.getTime() - secondDate.getTime();
								});

								return newSchedule;
							});

							this.loading = false;
						},
						error: () => {
							this.loading = false;
						}
					});
			}
			else {
				this.loading = false;
			}
		});
	}

	dismissNotification(notification: WyRefereeNotification) {
		this.settingsStore.set(`notification-${this.currentVersion}-dismissed`, true);
		this.notifications = this.notifications.filter(n => n.id !== notification.id);
	}
}
