import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main-page/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorComponent } from './components/main-page/error/error.component';
import { InformationComponent } from './components/information/information.component';
import { AllLobbiesComponent } from './components/lobby/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/lobby/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby/lobby-view/lobby-view.component';
import { MappoolOverviewComponent } from './components/tournament-management/mappool/mappool-overview/mappool-overview.component';
import { MappoolCreateComponent } from './components/tournament-management/mappool/mappool-create/mappool-create.component';
import { IrcComponent } from './components/irc/irc.component';
import { RegisterComponent } from './components/register/register.component';
import { TournamentCreateComponent } from './components/tournament-management/tournament/tournament-create/tournament-create.component';
import { TournamentOverviewComponent } from './components/tournament-management/tournament/tournament-overview/tournament-overview.component';
import { TournamentEditComponent } from './components/tournament-management/tournament/tournament-edit/tournament-edit.component';
import { MyPublishedMappoolsComponent } from './components/tournament-management/mappool/my-published-mappools/my-published-mappools.component';
import { MappoolEditComponent } from './components/tournament-management/mappool/mappool-edit/mappool-edit.component';
import { MyPublishedTournamentsComponent } from './components/tournament-management/tournament/my-published-tournaments/my-published-tournaments.component';
import { ManagementRouterComponent } from './components/tournament-management/management-router/management-router.component';
import { AllPublishedMappoolsComponent } from './components/tournament-management/mappool/all-published-mappools/all-published-mappools.component';
import { AllPublishedTournamentsComponent } from './components/tournament-management/tournament/all-published-tournaments/all-published-tournaments.component';
import { AxsCalculatorComponent } from './components/axs-calculator/axs-calculator.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent,
		children: [
			{ path: '', component: InformationComponent },
			{ path: 'information', component: InformationComponent },
			{ path: 'settings', component: SettingsComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: 'lobby-overview', component: AllLobbiesComponent },
			{ path: 'lobby-overview/create-lobby', component: CreateLobbyComponent },
			{ path: 'lobby-overview/lobby-view/:id', component: LobbyViewComponent },
			{
				path: 'tournament-management', component: ManagementRouterComponent, children: [
					{ path: 'mappool-overview', component: MappoolOverviewComponent },
					{ path: 'mappool-overview/mappool-create', component: MappoolCreateComponent },
					{ path: 'mappool-overview/mappool-edit/:mappoolId/:publish', component: MappoolEditComponent },
					{ path: 'mappool-overview/my-published-mappools', component: MyPublishedMappoolsComponent },
					{ path: 'mappool-overview/all-published-mappools', component: AllPublishedMappoolsComponent },

					{ path: 'tournament-overview', component: TournamentOverviewComponent },
					{ path: 'tournament-overview/tournament-create', component: TournamentCreateComponent },
					{ path: 'tournament-overview/tournament-edit/:tournamentId/:publish', component: TournamentEditComponent },
					{ path: 'tournament-overview/my-published-tournaments', component: MyPublishedTournamentsComponent },
					{ path: 'tournament-overview/all-published-tournaments', component: AllPublishedTournamentsComponent }
				]
			},
			{ path: 'irc', component: IrcComponent },
			{ path: 'axs-calculator', component: AxsCalculatorComponent },
			{ path: '**', component: ErrorComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})

export class AppRoutingModule { }
