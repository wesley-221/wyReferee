import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { TournamentManagementRoutingModule } from './tournament-management-routing.module';
import { ManagementRouterComponent } from './components/management-router/management-router.component';
import { MappoolComponent } from './components/mappool/mappool/mappool.component';
import { ModBracketComponent } from './components/mappool/mod-bracket/mod-bracket.component';
import { MappoolCreateComponent } from './components/mappool-create/mappool-create.component';
import { TournamentComponent } from './components/tournament/tournament/tournament.component';
import { TournamentAccessComponent } from './components/tournament/tournament-access/tournament-access.component';
import { TournamentGeneralComponent } from './components/tournament/tournament-general/tournament-general.component';
import { TournamentParticipantsComponent } from './components/tournament/tournament-participants/tournament-participants.component';
import { TournamentStagesComponent } from './components/tournament/tournament-stages/tournament-stages.component';
import { TournamentWebhookComponent } from './components/tournament/tournament-webhook/tournament-webhook.component';
import { TournamentAllPublishedComponent } from './components/tournament-all-published/tournament-all-published.component';
import { TournamentAllPublishedAdministratorComponent } from './components/tournament-all-published-administrator/tournament-all-published-administrator.component';
import { TournamentCardComponent } from './components/tournament-card/tournament-card.component';
import { TournamentCreateComponent } from './components/tournament-create/tournament-create.component';
import { TournamentEditComponent } from './components/tournament-edit/tournament-edit.component';
import { TournamentMyPublishedComponent } from './components/tournament-my-published/tournament-my-published.component';
import { TournamentOverviewComponent } from './components/tournament-overview/tournament-overview.component';
import { TournamentPublishedEditComponent } from './components/tournament-published-edit/tournament-published-edit.component';
import { TournamentWybinComponent } from './components/tournament/tournament-wybin/tournament-wybin.component';
import { TournamentBeatmapResultComponent } from './components/tournament/tournament-beatmap-result/tournament-beatmap-result.component';

@NgModule({
	declarations: [
		ManagementRouterComponent,
		MappoolComponent,
		ModBracketComponent,
		MappoolCreateComponent,
		TournamentComponent,
		TournamentAccessComponent,
		TournamentGeneralComponent,
		TournamentParticipantsComponent,
		TournamentStagesComponent,
		TournamentWebhookComponent,
		TournamentAllPublishedComponent,
		TournamentAllPublishedAdministratorComponent,
		TournamentCardComponent,
		TournamentCreateComponent,
		TournamentEditComponent,
		TournamentMyPublishedComponent,
		TournamentOverviewComponent,
		TournamentPublishedEditComponent,
		TournamentWybinComponent,
		TournamentBeatmapResultComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		TournamentManagementRoutingModule
	]
})
export class TournamentManagementModule { }
