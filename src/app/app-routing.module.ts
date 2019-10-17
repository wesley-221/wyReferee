import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main-page/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorComponent } from './components/main-page/error/error.component';
import { InformationComponent } from './components/information/information.component';
import { AllLobbiesComponent } from './components/lobby/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/lobby/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby/lobby-view/lobby-view.component';
import { MappoolOverviewComponent } from './components/mappool/mappool-overview/mappool-overview.component';
import { MappoolCreateComponent } from './components/mappool/mappool-create/mappool-create.component';
import { MappoolBracketEditComponent } from './components/mappool/mappool-bracket-edit/mappool-bracket-edit.component';
import { LoginComponent } from './components/authentication/login/login.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent, 
		children: [
			{ path: '', component: InformationComponent },
			{ path: 'information', component: InformationComponent },
			{ path: 'settings', component: SettingsComponent}, 
			{ path: 'login', component: LoginComponent },
			{ path: 'lobby-overview', component: AllLobbiesComponent },
			{ path: 'create-lobby', component: CreateLobbyComponent },
			{ path: 'lobby-view/:id', component: LobbyViewComponent },
			{ path: 'mappool-overview', component: MappoolOverviewComponent },
			{ path: 'mappool-create', component: MappoolCreateComponent },
			{ path: 'edit-bracket/:mappoolId/:bracketId', component: MappoolBracketEditComponent },
			{ path: '**', component: ErrorComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})

export class AppRoutingModule {}
