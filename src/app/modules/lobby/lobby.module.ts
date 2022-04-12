import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { LobbyRoutingModule } from './lobby-routing.module';
import { AllLobbiesComponent } from './components/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby-view/lobby-view.component';

@NgModule({
	declarations: [
		AllLobbiesComponent,
		CreateLobbyComponent,
		LobbyViewComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		LobbyRoutingModule
	]
})
export class LobbyModule { }
