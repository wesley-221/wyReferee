import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { TournamentManagementRoutingModule } from './tournament-management-routing.module';
import { ManagementRouterComponent } from './components/management-router/management-router.component';
import { MappoolComponent } from './pages/tournament/tournament-mappool/mappool/mappool.component';
import { ModBracketComponent } from './pages/tournament/tournament-mappool/mod-bracket/mod-bracket.component';
import { MappoolOverviewComponent } from './pages/tournament/tournament-mappool/mappool-overview/mappool-overview.component';
import { TournamentAccessComponent } from './pages/tournament/tournament-access/tournament-access.component';
import { TournamentGeneralComponent } from './pages/tournament/tournament-general/tournament-general.component';
import { TournamentParticipantsComponent } from './pages/tournament/tournament-participants/tournament-participants.component';
import { TournamentStagesComponent } from './pages/tournament/tournament-stages/tournament-stages.component';
import { TournamentWebhookComponent } from './pages/tournament/tournament-webhook/tournament-webhook.component';
import { ImportTournamentComponent } from './pages/import-tournament/import-tournament.component';
import { AdministratorTournamentsComponent } from './pages/administrator-tournaments/administrator-tournaments.component';
import { TournamentCardComponent } from './components/tournament-card/tournament-card.component';
import { TournamentCreateComponent } from './pages/tournament-create/tournament-create.component';
import { TournamentWybinComponent } from './pages/tournament/tournament-wybin/tournament-wybin.component';
import { TournamentTriggerMessageComponent } from './pages/tournament/tournament-trigger-message/tournament-trigger-message.component';
import { TournamentEditComponent } from './pages/tournament-edit/tournament-edit.component';
import { LocalTournamentsComponent } from './pages/local-tournaments/local-tournaments.component';
import { PublishedTournamentsComponent } from './pages/published-tournaments/published-tournaments.component';
import { TournamentFiltersComponent } from './components/tournament-filters/tournament-filters.component';
import { ManagementSidebarComponent } from './components/management-sidebar/management-sidebar.component';
import { TournamentErrorFooterComponent } from './components/tournament-error-footer/tournament-error-footer.component';

@NgModule({
	declarations: [
		ManagementRouterComponent,
		MappoolComponent,
		ModBracketComponent,
		MappoolOverviewComponent,
		TournamentAccessComponent,
		TournamentGeneralComponent,
		TournamentParticipantsComponent,
		TournamentStagesComponent,
		TournamentWebhookComponent,
		ImportTournamentComponent,
		AdministratorTournamentsComponent,
		TournamentCardComponent,
		TournamentCreateComponent,
		TournamentWybinComponent,
		TournamentTriggerMessageComponent,
		TournamentEditComponent,
		LocalTournamentsComponent,
		PublishedTournamentsComponent,
		TournamentFiltersComponent,
		ManagementSidebarComponent,
		TournamentErrorFooterComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		TournamentManagementRoutingModule,
		ScrollingModule
	]
})
export class TournamentManagementModule { }
