import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main-page/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorComponent } from './components/main-page/error/error.component';
import { InformationComponent } from './components/information/information.component';
import { AllLobbiesComponent } from './components/lobby/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/lobby/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby/lobby-view/lobby-view.component';
import { IrcComponent } from './components/irc/irc.component';
import { RegisterComponent } from './components/register/register.component';
import { ManagementRouterComponent } from './components/tournament-management/management-router/management-router.component';
import { AxsCalculatorComponent } from './components/axs/axs-calculator/axs-calculator.component';
import { AxsRouterComponent } from './components/axs/axs-router/axs-router.component';
import { AxsInformationComponent } from './components/axs/axs-information/axs-information.component';
import { AxsFormulaComponent } from './components/axs/axs-formula/axs-formula.component';
import { TournamentCreateComponent } from './components/tournament-management/tournament/tournament-create/tournament-create.component';

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
					// { path: 'mappool-overview', component: MappoolOverviewComponent },
					// { path: 'mappool-overview/mappool-create', component: MappoolCreateComponent },
					// { path: 'mappool-overview/mappool-edit/:mappoolId/:publish', component: MappoolEditComponent },
					// { path: 'mappool-overview/my-published-mappools', component: MyPublishedMappoolsComponent },
					// { path: 'mappool-overview/all-published-mappools', component: AllPublishedMappoolsComponent },

					// { path: 'tournament-overview', component: TournamentOverviewComponent },
					{ path: 'tournament-overview/tournament-create', component: TournamentCreateComponent },
					// { path: 'tournament-overview/tournament-edit/:tournamentId/:publish', component: TournamentEditComponent },
					// { path: 'tournament-overview/my-published-tournaments', component: MyPublishedTournamentsComponent },
					// { path: 'tournament-overview/all-published-tournaments', component: AllPublishedTournamentsComponent }
				]
			},
			{
				path: 'axs', component: AxsRouterComponent, children: [
					{ path: 'information', component: AxsInformationComponent },
					{ path: 'manual-calculator', component: AxsCalculatorComponent },
					{ path: 'axs-formula', component: AxsFormulaComponent },
					{ path: '**', component: AxsInformationComponent }
				]
			},
			{ path: 'irc', component: IrcComponent },
			{ path: '**', component: ErrorComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})

export class AppRoutingModule { }
