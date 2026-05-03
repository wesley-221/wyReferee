import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementRouterComponent } from './components/management-router/management-router.component';
import { AdministratorTournamentsComponent } from './pages/administrator-tournaments/administrator-tournaments.component';
import { ImportTournamentComponent } from './pages/import-tournament/import-tournament.component';
import { TournamentCreateComponent } from './pages/tournament-create/tournament-create.component';
import { TournamentEditComponent } from './pages/tournament-edit/tournament-edit.component';
import { LocalTournamentsComponent } from './pages/local-tournaments/local-tournaments.component';
import { PublishedTournamentsComponent } from './pages/published-tournaments/published-tournaments.component';
import { TournamentGeneralComponent } from './components/tournament/tournament-general/tournament-general.component';
import { TournamentWybinComponent } from './components/tournament/tournament-wybin/tournament-wybin.component';
import { TournamentAccessComponent } from './components/tournament/tournament-access/tournament-access.component';
import { TournamentWebhookComponent } from './components/tournament/tournament-webhook/tournament-webhook.component';
import { TournamentStagesComponent } from './components/tournament/tournament-stages/tournament-stages.component';
import { TournamentParticipantsComponent } from './components/tournament/tournament-participants/tournament-participants.component';
import { MappoolOverviewComponent } from './components/tournament/tournament-mappool/mappool-overview/mappool-overview.component';
import { TournamentTriggerMessageComponent } from './components/tournament/tournament-trigger-message/tournament-trigger-message.component';

const routes: Routes = [
	{
		path: '', component: ManagementRouterComponent, children: [
			{ path: '', redirectTo: 'local-tournaments', pathMatch: 'full' },
			{ path: 'local-tournaments', component: LocalTournamentsComponent },
			{ path: 'published-tournaments', component: PublishedTournamentsComponent },
			{ path: 'import-tournament', component: ImportTournamentComponent },
			{ path: 'administrator-tournaments', component: AdministratorTournamentsComponent },
			{
				path: 'tournament-create/:published/:id', component: TournamentCreateComponent, children: [
					{ path: '', redirectTo: 'general', pathMatch: 'full' },
					{ path: 'general', component: TournamentGeneralComponent },
					{ path: 'wybin', component: TournamentWybinComponent },
					{ path: 'access', component: TournamentAccessComponent },
					{ path: 'webhook', component: TournamentWebhookComponent },
					{ path: 'trigger-messages', component: TournamentTriggerMessageComponent },
					{ path: 'stages', component: TournamentStagesComponent },
					{ path: 'participants', component: TournamentParticipantsComponent },
					{ path: 'mappool', component: MappoolOverviewComponent }
				]
			},
			{
				path: 'tournament-edit/:published/:id', component: TournamentEditComponent, children: [
					{ path: '', redirectTo: 'general', pathMatch: 'full' },
					{ path: 'general', component: TournamentGeneralComponent },
					{ path: 'wybin', component: TournamentWybinComponent },
					{ path: 'access', component: TournamentAccessComponent },
					{ path: 'webhook', component: TournamentWebhookComponent },
					{ path: 'trigger-messages', component: TournamentTriggerMessageComponent },
					{ path: 'stages', component: TournamentStagesComponent },
					{ path: 'participants', component: TournamentParticipantsComponent },
					{ path: 'mappool', component: MappoolOverviewComponent }
				]
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TournamentManagementRoutingModule { }
