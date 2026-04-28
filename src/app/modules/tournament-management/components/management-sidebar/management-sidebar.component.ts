import { Component } from '@angular/core';
import { INavigationItem } from '../../../../interfaces/i-navigation-item';
import { AuthenticateService } from '../../../../services/authenticate.service';
import { Observable, map } from 'rxjs';
import { ManagementSidebarService } from '../../services/management-sidebar.service';

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

	sidebarMenu$: Observable<INavigationItem[]>;

	constructor(
		private authenticateService: AuthenticateService,
		private managementSidebarService: ManagementSidebarService
	) {
		this.sidebarMenu$ = this.managementSidebarService.getSidebarMenu();
	}
}
