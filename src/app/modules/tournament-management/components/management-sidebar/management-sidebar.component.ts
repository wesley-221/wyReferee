import { Component } from '@angular/core';
import { INavigationItem } from '../../../../interfaces/i-navigation-item';
import { AuthenticateService } from '../../../../services/authenticate.service';
import { map } from 'rxjs';

@Component({
	selector: 'app-management-sidebar',
	templateUrl: './management-sidebar.component.html',
	styleUrl: './management-sidebar.component.scss'
})
export class ManagementSidebarComponent {
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
		{ icon: 'computer', header: 'local', link: 'local-tournaments' },
		{ icon: 'language', header: 'published', link: 'published-tournaments', showIfObservable: this.isLoggedIn$ },
		{ type: 'divider' },
		{ icon: 'add', header: 'create', link: 'create' },
		{ icon: 'cloud_download', header: 'import tournament', link: 'import-tournament', showIfObservable: this.isLoggedIn$ },
		{ icon: 'admin_panel_settings', header: 'administrator', link: 'administrator-tournaments', showIfObservable: this.isTournamentManager$ },
	];

	constructor(private authenticateService: AuthenticateService) { }
}
