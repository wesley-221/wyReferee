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
import { MappoolOverviewComponent } from './components/tournament-management/mappool/mappool-overview/mappool-overview.component';
import { MappoolCreateComponent } from './components/tournament-management/mappool/mappool-create/mappool-create.component';
import { AuthInterceptor } from './token-interceptor';
import { IrcComponent } from './components/irc/irc.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { SearchModBracketPipe } from './pipes/search-mod-bracket.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { RegisterComponent } from './components/register/register.component';
import { TournamentCreateComponent } from './components/tournament-management/tournament/tournament-create/tournament-create.component';
import { TournamentOverviewComponent } from './components/tournament-management/tournament/tournament-overview/tournament-overview.component';
import { TournamentEditComponent } from './components/tournament-management/tournament/tournament-edit/tournament-edit.component';
import { TournamentComponent } from './components/tournament-management/tournament/tournament/tournament.component';
import { ModBracketComponent } from './components/tournament-management/mappool/mod-bracket/mod-bracket.component';
import { MyPublishedMappoolsComponent } from './components/tournament-management/mappool/my-published-mappools/my-published-mappools.component';
import { MappoolSummaryComponent } from './components/tournament-management/mappool/mappool-summary/mappool-summary.component';
import { MappoolEditComponent } from './components/tournament-management/mappool/mappool-edit/mappool-edit.component';
import { MappoolComponent } from './components/tournament-management/mappool/mappool/mappool.component';
import { TournamentSummaryComponent } from './components/tournament-management/tournament/tournament-summary/tournament-summary.component';
import { MyPublishedTournamentsComponent } from './components/tournament-management/tournament/my-published-tournaments/my-published-tournaments.component';
import { RemoveSettingsComponent } from './components/dialogs/remove-settings/remove-settings.component';
import { DeleteLobbyComponent } from './components/dialogs/delete-lobby/delete-lobby.component';
import { ManagementRouterComponent } from './components/tournament-management/management-router/management-router.component';
import { PublishMappoolComponent } from './components/dialogs/publish-mappool/publish-mappool.component';
import { DeleteMappoolComponent } from './components/dialogs/delete-mappool/delete-mappool.component';
import { DeleteModBracketComponent } from './components/dialogs/delete-mod-bracket/delete-mod-bracket.component';
import { DeleteTournamentComponent } from './components/dialogs/delete-tournament/delete-tournament.component';
import { PublishTournamentComponent } from './components/dialogs/publish-tournament/publish-tournament.component';
import { TeamComponent } from './components/tournament-management/tournament/team/team.component';
import { DeleteTeamComponent } from './components/dialogs/delete-team/delete-team.component';
import { MultiplayerLobbySettingsComponent } from './components/dialogs/multiplayer-lobby-settings/multiplayer-lobby-settings.component';
import { SendFinalResultComponent } from './components/dialogs/send-final-result/send-final-result.component';
import { JoinIrcChannelComponent } from './components/dialogs/join-irc-channel/join-irc-channel.component';
import { BanBeatmapComponent } from './components/dialogs/ban-beatmap/ban-beatmap.component';
import { MultiplayerLobbyMovePlayerComponent } from './components/dialogs/multiplayer-lobby-move-player/multiplayer-lobby-move-player.component';
import { UpdaterComponent } from './components/main-page/updater/updater.component';
import { AllPublishedMappoolsComponent } from './components/tournament-management/mappool/all-published-mappools/all-published-mappools.component';
import { FilterMappoolPipe } from './pipes/filter-mappool.pipe';
import { AllPublishedTournamentsComponent } from './components/tournament-management/tournament/all-published-tournaments/all-published-tournaments.component';
import { FilterTournamentPipe } from './pipes/filter-tournament.pipe';
import { AxsCalculatorComponent } from './components/axs-calculator/axs-calculator.component';
import { SendBeatmapResultComponent } from './components/dialogs/send-beatmap-result/send-beatmap-result.component';
import { ReversePipe } from './pipes/reverse.pipe';

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
		MappoolOverviewComponent,
		MappoolCreateComponent,
		IrcComponent,
		SearchModBracketPipe,
		SearchPipe,
		RegisterComponent,
		TournamentCreateComponent,
		TournamentOverviewComponent,
		TournamentEditComponent,
		TournamentComponent,
		ModBracketComponent,
		MyPublishedMappoolsComponent,
		MappoolSummaryComponent,
		MappoolEditComponent,
		MappoolComponent,
		TournamentSummaryComponent,
		MyPublishedTournamentsComponent,
		RemoveSettingsComponent,
		DeleteLobbyComponent,
		ManagementRouterComponent,
		PublishMappoolComponent,
		DeleteMappoolComponent,
		DeleteModBracketComponent,
		DeleteTournamentComponent,
		PublishTournamentComponent,
		TeamComponent,
		DeleteTeamComponent,
		MultiplayerLobbySettingsComponent,
		SendFinalResultComponent,
		JoinIrcChannelComponent,
		BanBeatmapComponent,
		MultiplayerLobbyMovePlayerComponent,
		UpdaterComponent,
		AllPublishedMappoolsComponent,
		FilterMappoolPipe,
		AllPublishedTournamentsComponent,
		FilterTournamentPipe,
		AxsCalculatorComponent,
		SendBeatmapResultComponent,
		ReversePipe
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
