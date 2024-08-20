import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { LobbyRoutingModule } from './lobby-routing.module';
import { AllLobbiesComponent } from './components/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby-view/lobby-view.component';
import { LobbyFormComponent } from './components/lobby-form/lobby-form.component';

@NgModule({
	declarations: [
		AllLobbiesComponent,
		CreateLobbyComponent,
		LobbyViewComponent,
		LobbyFormComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		LobbyRoutingModule
	]
})
export class LobbyModule { }
