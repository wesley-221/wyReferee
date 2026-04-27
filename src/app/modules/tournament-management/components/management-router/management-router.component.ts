import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'app/services/authenticate.service';
import { INavigationItem } from '../../../../interfaces/i-navigation-item';
import { map } from 'rxjs';

@Component({
	selector: 'app-management-router',
	templateUrl: './management-router.component.html',
	styleUrls: ['./management-router.component.scss']
})
export class ManagementRouterComponent implements OnInit {
	isLoggedIn$ = this.authenticateService.userLoggedIn()
		.pipe(
			map(loggedIn => {
				return loggedIn ?? false;
			})
		);

	isTournamentManager$ = this.authenticateService.userLoggedIn()
		.pipe(
			map(() => {
				const user = this.authenticateService.loggedInUser;
				return user && (user.isAdmin || user.isTournamentManager) ? true : false;
			})
		);

	sidebarMenu: INavigationItem[] = [
		{ icon: 'computer', header: 'local', link: '/tournament-management/tournament-overview' },
		{ icon: 'language', header: 'published', link: '/tournament-management/tournament-overview', showIfObservable: this.isLoggedIn$ },
		{ type: 'divider' },
		{ icon: 'add', header: 'create', link: '/tournament-management/tournament-overview' },
		{ icon: 'list', header: 'all tournaments', link: '/tournament-management/tournament-overview', showIfObservable: this.isLoggedIn$ },
		{ icon: 'admin_panel_settings', header: 'administrator', link: '/tournament-management/tournament-overview', showIfObservable: this.isTournamentManager$ },
	];

	constructor(public authenticateService: AuthenticateService) { }

	ngOnInit(): void { }
}
