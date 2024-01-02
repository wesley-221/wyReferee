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
import { TournamentAllPublishedComponent } from './components/tournament-view/tournament-all-published/tournament-all-published.component';
import { TournamentAllPublishedAdministratorComponent } from './components/tournament-view/tournament-all-published-administrator/tournament-all-published-administrator.component';
import { TournamentCardComponent } from './components-utility/tournament-card/tournament-card.component';
import { TournamentCreateComponent } from './components/tournament-manage/tournament-create/tournament-create.component';
import { TournamentMyPublishedComponent } from './components/tournament-view/tournament-my-published/tournament-my-published.component';
import { TournamentOverviewComponent } from './components/tournament-view/tournament-overview/tournament-overview.component';
import { TournamentWybinComponent } from './components-utility/tournament/tournament-wybin/tournament-wybin.component';
import { TournamentBeatmapResultComponent } from './components-utility/tournament/tournament-beatmap-result/tournament-beatmap-result.component';
import { TournamentEditNewComponent } from './components/tournament-manage/tournament-edit-new/tournament-edit-new.component';

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
		TournamentAllPublishedComponent,
		TournamentAllPublishedAdministratorComponent,
		TournamentCardComponent,
		TournamentCreateComponent,
		TournamentMyPublishedComponent,
		TournamentOverviewComponent,
		TournamentWybinComponent,
		TournamentBeatmapResultComponent,
		TournamentEditNewComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		TournamentManagementRoutingModule
	]
})
export class TournamentManagementModule { }
