import { Injectable } from '@angular/core';
import { INavigationItem } from '../../../interfaces/i-navigation-item';
import { AuthenticateService } from '../../../services/authenticate.service';
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ManagementSidebarService {
	isLoggedIn$ = this.authenticateService.userLoggedIn()
		.pipe(
			map(loggedIn => {
				return loggedIn ?? false;
			}),
			shareReplay(1)
		);

	isTournamentManager$ = this.authenticateService.userLoggedIn()
		.pipe(
			map(() => {
				const user = this.authenticateService.loggedInUser;
				return user && (user.isAdmin || user.isTournamentManager) ? true : false;
			}),
			shareReplay(1)
		);

	private readonly defaultRoutesItems: INavigationItem[] = [
		{ icon: 'computer', header: 'local', link: 'local-tournaments' },
		{ icon: 'language', header: 'published', link: 'published-tournaments', showIfObservable: this.isLoggedIn$ },
		{ type: 'divider' },
		{ icon: 'add', header: 'create', link: 'create' },
		{ icon: 'cloud_download', header: 'import tournament', link: 'import-tournament', showIfObservable: this.isLoggedIn$ },
		{ icon: 'admin_panel_settings', header: 'administrator', link: 'administrator-tournaments', showIfObservable: this.isTournamentManager$ },
	];

	private readonly tournamentManagementItems: INavigationItem[] = [
		{ type: 'link', icon: 'arrow_back', header: 'management', link: '/tournament-management' },
		{ type: 'divider' },
		{ icon: 'settings', header: 'general', link: 'general' },
		{ icon: 'storage', header: 'wyBin', link: 'wybin' },
		{ icon: 'lock', header: 'access', link: 'access' },
		{ type: 'divider' },
		{ icon: 'webhook', header: 'webhook', link: 'webhook' },
		{ icon: 'message', header: 'conditional messages', link: 'conditional-messages' },
		{ type: 'divider' },
		{ icon: 'timeline', header: 'stages', link: 'stages' },
		{ icon: 'people', header: 'participants', link: 'participants' },
		{ icon: 'map', header: 'mappool', link: 'mappool' }
	];

	private sidebarMenu$: BehaviorSubject<INavigationItem[]>;

	constructor(
		private authenticateService: AuthenticateService
	) {
		this.sidebarMenu$ = new BehaviorSubject<INavigationItem[]>(this.defaultRoutesItems);
	}

	getSidebarMenu(): Observable<INavigationItem[]> {
		return this.sidebarMenu$.asObservable();
	}

	setTournamentManagementItems() {
		this.sidebarMenu$.next(this.tournamentManagementItems);
	}

	setDefaultItems() {
		this.sidebarMenu$.next(this.defaultRoutesItems);
	}
}
