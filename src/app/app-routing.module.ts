import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main-page/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorComponent } from './components/main-page/error/error.component';
import { InformationComponent } from './components/information/information.component';
import { AllLobbiesComponent } from './components/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby-view/lobby-view.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent, 
		children: [
			{ path: '', component: InformationComponent },
			{ path: 'information', component: InformationComponent },
			{ path: 'settings', component: SettingsComponent}, 
			{ path: 'lobby-overview', component: AllLobbiesComponent },
			{ path: 'create-lobby', component: CreateLobbyComponent },
			{ path: 'lobby-view/:id', component: LobbyViewComponent },
			{ path: '**', component: ErrorComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})

export class AppRoutingModule {}
