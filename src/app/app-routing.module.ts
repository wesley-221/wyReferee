import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main-page/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorComponent } from './components/main-page/error/error.component';
import { InformationComponent } from './modules/information/components/information/information.component';
import { AllLobbiesComponent } from './components/lobby/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/lobby/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby/lobby-view/lobby-view.component';
import { IrcComponent } from './components/irc/irc.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent,
		children: [
			{ path: '', component: InformationComponent },
			{
				path: 'information', loadChildren: () =>
					import('./modules/information/information.module').then(m => m.InformationModule)
			},
			{ path: 'settings', component: SettingsComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: 'lobby-overview', component: AllLobbiesComponent },
			{ path: 'lobby-overview/create-lobby', component: CreateLobbyComponent },
			{ path: 'lobby-overview/lobby-view/:id', component: LobbyViewComponent },
			{
				path: 'tournament-management', loadChildren: () =>
					import('./modules/tournament-management/tournament-management.module').then(m => m.TournamentManagementModule)
			},
			{
				path: 'axs',
				loadChildren: () =>
					import('./modules/axs/axs.module').then(m => m.AxsModule)
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
