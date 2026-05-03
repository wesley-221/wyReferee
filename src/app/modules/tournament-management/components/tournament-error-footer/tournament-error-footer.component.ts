import { Component, Input } from '@angular/core';
import { PageState, TournamentEditStateService } from '../../services/tournament-edit-state.service';
import { ManagementSidebarService } from '../../services/management-sidebar.service';

@Component({
	selector: 'app-tournament-error-footer',
	templateUrl: './tournament-error-footer.component.html',
	styleUrl: './tournament-error-footer.component.scss'
})
export class TournamentErrorFooterComponent {
	pageState$ = this.tournamentEditStateService.pageState$;

	errorFooterVisible: boolean;

	constructor(
		private tournamentEditStateService: TournamentEditStateService,
		private managementSidebarService: ManagementSidebarService
	) {
		this.errorFooterVisible = false;
	}

	toggleErrorFooter() {
		this.errorFooterVisible = !this.errorFooterVisible;
	}

	getErrorLink(errorSection: string): string {
		if (errorSection == 'triggerMessages') {
			errorSection = 'trigger-messages';
		}

		errorSection = errorSection.toLowerCase();

		return `${this.managementSidebarService.baseLink}/${errorSection}`;
	}
}
