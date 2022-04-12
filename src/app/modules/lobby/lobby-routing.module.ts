import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllLobbiesComponent } from './components/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby-view/lobby-view.component';

const routes: Routes = [
	{ path: '', component: AllLobbiesComponent },
	{ path: 'create-lobby', component: CreateLobbyComponent },
	{ path: 'lobby-view/:id', component: LobbyViewComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LobbyRoutingModule { }
