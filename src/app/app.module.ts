import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularMaterialModule } from './angular-material-module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main-page/main/main.component';
import { SidebarComponent } from './components/main-page/sidebar/sidebar.component';

import { SettingsComponent } from './components/settings/settings.component';
import { ErrorComponent } from './components/main-page/error/error.component';
import { InformationComponent } from './components/information/information.component';
import { ToastComponent } from './components/main-page/toast/toast.component';
import { AllLobbiesComponent } from './components/lobby/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/lobby/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby/lobby-view/lobby-view.component';
import { AuthInterceptor } from './token-interceptor';
import { IrcComponent } from './components/irc/irc.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { SearchModBracketPipe } from './pipes/search-mod-bracket.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { RegisterComponent } from './components/register/register.component';
import { RemoveSettingsComponent } from './components/dialogs/remove-settings/remove-settings.component';
import { DeleteLobbyComponent } from './components/dialogs/delete-lobby/delete-lobby.component';
import { ManagementRouterComponent } from './components/tournament-management/management-router/management-router.component';
import { MultiplayerLobbySettingsComponent } from './components/dialogs/multiplayer-lobby-settings/multiplayer-lobby-settings.component';
import { SendFinalResultComponent } from './components/dialogs/send-final-result/send-final-result.component';
import { JoinIrcChannelComponent } from './components/dialogs/join-irc-channel/join-irc-channel.component';
import { BanBeatmapComponent } from './components/dialogs/ban-beatmap/ban-beatmap.component';
import { MultiplayerLobbyMovePlayerComponent } from './components/dialogs/multiplayer-lobby-move-player/multiplayer-lobby-move-player.component';
import { UpdaterComponent } from './components/main-page/updater/updater.component';
import { FilterMappoolPipe } from './pipes/filter-mappool.pipe';
import { FilterTournamentPipe } from './pipes/filter-tournament.pipe';
import { AxsCalculatorComponent } from './components/axs/axs-calculator/axs-calculator.component';
import { SendBeatmapResultComponent } from './components/dialogs/send-beatmap-result/send-beatmap-result.component';
import { ReversePipe } from './pipes/reverse.pipe';
import { AxsInformationComponent } from './components/axs/axs-information/axs-information.component';
import { AxsRouterComponent } from './components/axs/axs-router/axs-router.component';
import { AxsFormulaComponent } from './components/axs/axs-formula/axs-formula.component';

@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		SidebarComponent,
		SettingsComponent,
		ErrorComponent,
		InformationComponent,
		ToastComponent,
		AllLobbiesComponent,
		CreateLobbyComponent,
		LobbyViewComponent,
		IrcComponent,
		SearchModBracketPipe,
		SearchPipe,
		RegisterComponent,
		RemoveSettingsComponent,
		DeleteLobbyComponent,
		ManagementRouterComponent,
		MultiplayerLobbySettingsComponent,
		SendFinalResultComponent,
		JoinIrcChannelComponent,
		BanBeatmapComponent,
		MultiplayerLobbyMovePlayerComponent,
		UpdaterComponent,
		FilterMappoolPipe,
		FilterTournamentPipe,
		AxsCalculatorComponent,
		SendBeatmapResultComponent,
		ReversePipe,
		AxsInformationComponent,
		AxsRouterComponent,
		AxsFormulaComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		AppRoutingModule,
		DragDropModule,
		VirtualScrollerModule,
		BrowserAnimationsModule,
		ClipboardModule,
		AngularMaterialModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})

export class AppModule {
	constructor() { }
}
