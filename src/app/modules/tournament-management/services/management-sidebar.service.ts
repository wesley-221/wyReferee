import { Injectable } from '@angular/core';
import { INavigationItem } from '../../../interfaces/i-navigation-item';
import { AuthenticateService } from '../../../services/authenticate.service';
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';
import { WyTournament } from '../../../models/wytournament/wy-tournament';
import { PageState, TournamentEditStateService } from './tournament-edit-state.service';

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
		{ type: 'header', header: 'browse' },
		{ icon: 'computer', header: 'local', link: 'local-tournaments' },
		{ icon: 'language', header: 'published', link: 'published-tournaments', showIfObservable: this.isLoggedIn$ },
		{ type: 'header', header: 'actions' },
		{ icon: 'add', header: 'create', link: 'tournament-create/0/0' },
		{ icon: 'cloud_download', header: 'import tournament', link: 'import-tournament', showIfObservable: this.isLoggedIn$ },
		{ icon: 'admin_panel_settings', header: 'administrator', link: 'administrator-tournaments', showIfObservable: this.isTournamentManager$ },
	];

	private sidebarMenu$: BehaviorSubject<INavigationItem[]>;
	private tournament$: BehaviorSubject<WyTournament>;

	constructor(
		private authenticateService: AuthenticateService,
		private tournamentEditStateService: TournamentEditStateService
	) {
		this.sidebarMenu$ = new BehaviorSubject<INavigationItem[]>(this.defaultRoutesItems);
		this.tournament$ = new BehaviorSubject<WyTournament>(null);
	}

	getSidebarMenu(): Observable<INavigationItem[]> {
		return this.sidebarMenu$.asObservable();
	}

	setTournamentManagementItems(type: 'local' | 'published' | 'create') {
		const tournament = this.tournament$.value;

		if (!tournament) {
			return;
		}

		this.tournamentEditStateService.pageState$.subscribe(pageState => {
			this.sidebarMenu$.next(this.buildTournamentManagementItems(tournament.id, type, pageState));
		});
	}

	setDefaultItems() {
		this.sidebarMenu$.next(this.defaultRoutesItems);
	}

	setTournament(tournament: WyTournament) {
		this.tournament$.next(tournament);
	}

	private buildTournamentManagementItems(tournamentId: number, type: 'local' | 'published' | 'create', pageState: PageState): INavigationItem[] {
		const baseLink = `/tournament-management/${type == 'create' ? 'tournament-create' : 'tournament-edit'}/${type == 'published' ? 1 : 0}/${tournamentId ?? 0}`;

		return [
			{ type: 'link', icon: 'arrow_back', header: 'management', link: '/tournament-management' },
			{ type: 'divider' },

			{ type: 'header', header: 'settings' },

			{ icon: 'settings', header: 'general', link: `${baseLink}/general`, validationBadgeCount: pageState.general.errorCount },
			{ icon: 'link', header: 'wyBin', link: `${baseLink}/wybin`, validationBadgeCount: pageState.wyBin.errorCount },
			{ icon: 'lock', header: 'access', link: `${baseLink}/access`, validationBadgeCount: pageState.access.errorCount },
			{ icon: 'webhook', header: 'webhook', link: `${baseLink}/webhook`, validationBadgeCount: pageState.webhooks.errorCount },
			{ icon: 'message', header: 'triggers', link: `${baseLink}/trigger-messages`, validationBadgeCount: pageState.triggerMessages.errorCount },

			{ type: 'header', header: 'structure' },

			{ icon: 'timeline', header: 'stages', link: `${baseLink}/stages`, validationBadgeCount: pageState.stages.errorCount },
			{ icon: 'people', header: 'participants', link: `${baseLink}/participants`, validationBadgeCount: pageState.participants.errorCount },
			{ icon: 'map', header: 'mappool', link: `${baseLink}/mappool`, validationBadgeCount: pageState.mappools.errorCount }
		];
	}
}
