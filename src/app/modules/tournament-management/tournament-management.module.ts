import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { TournamentManagementRoutingModule } from './tournament-management-routing.module';
import { ManagementRouterComponent } from './components/management-router/management-router.component';
import { MappoolComponent } from './components-utility/tournament/tournament-mappool/mappool/mappool.component';
import { ModBracketComponent } from './components-utility/tournament/tournament-mappool/mod-bracket/mod-bracket.component';
import { MappoolOverviewComponent } from './components-utility/tournament/tournament-mappool/mappool-overview/mappool-overview.component';
import { TournamentComponent } from './components-utility/tournament/tournament/tournament.component';
import { TournamentAccessComponent } from './components-utility/tournament/tournament-access/tournament-access.component';
import { TournamentGeneralComponent } from './components-utility/tournament/tournament-general/tournament-general.component';
import { TournamentParticipantsComponent } from './components-utility/tournament/tournament-participants/tournament-participants.component';
import { TournamentStagesComponent } from './components-utility/tournament/tournament-stages/tournament-stages.component';
import { TournamentWebhookComponent } from './components-utility/tournament/tournament-webhook/tournament-webhook.component';
import { ImportTournamentComponent } from './pages/import-tournament/import-tournament.component';
import { AdministratorTournamentsComponent } from './pages/administrator-tournaments/administrator-tournaments.component';
import { TournamentCardComponent } from './components-utility/tournament-card/tournament-card.component';
import { TournamentCreateComponent } from './pages/tournament-create/tournament-create.component';
import { TournamentWybinComponent } from './components-utility/tournament/tournament-wybin/tournament-wybin.component';
import { TournamentConditionalMessageComponent } from './components-utility/tournament/tournament-beatmap-result/tournament-conditional-message.component';
import { TournamentEditComponent } from './components/tournament-manage/tournament-edit/tournament-edit.component';
import { LocalTournamentsComponent } from './pages/local-tournaments/local-tournaments.component';
import { PublishedTournamentsComponent } from './pages/published-tournaments/published-tournaments.component';

@NgModule({
	declarations: [
		ManagementRouterComponent,
		MappoolComponent,
		ModBracketComponent,
		MappoolOverviewComponent,
		TournamentComponent,
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
		TournamentConditionalMessageComponent,
		TournamentEditComponent,
		LocalTournamentsComponent,
		PublishedTournamentsComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		TournamentManagementRoutingModule
	]
})
export class TournamentManagementModule { }
