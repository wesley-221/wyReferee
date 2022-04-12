import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main-page/main/main.component';
import { SidebarComponent } from './components/main-page/sidebar/sidebar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorComponent } from './components/main-page/error/error.component';
import { ToastComponent } from './components/main-page/toast/toast.component';
import { AllLobbiesComponent } from './components/lobby/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/lobby/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby/lobby-view/lobby-view.component';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { IrcComponent } from './components/irc/irc.component';
import { SearchModBracketPipe } from './core/pipes/search-mod-bracket.pipe';
import { SearchPipe } from './core/pipes/search.pipe';
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
import { FilterTournamentPipe } from './core/pipes/filter-tournament.pipe';
import { SendBeatmapResultComponent } from './components/dialogs/send-beatmap-result/send-beatmap-result.component';
import { ReversePipe } from './core/pipes/reverse.pipe';
import { TournamentComponent } from './components/tournament-management/tournament/tournament/tournament.component';
import { TournamentCreateComponent } from './components/tournament-management/tournament-create/tournament-create.component';
import { TournamentAddUserDialogComponent } from './components/dialogs/tournament-add-user-dialog/tournament-add-user-dialog.component';
import { MappoolComponent } from './components/tournament-management/mappool/mappool/mappool.component';
import { ModBracketComponent } from './components/tournament-management/mappool/mod-bracket/mod-bracket.component';
import { TournamentGeneralComponent } from './components/tournament-management/tournament/tournament-general/tournament-general.component';
import { TournamentAccessComponent } from './components/tournament-management/tournament/tournament-access/tournament-access.component';
import { TournamentWebhookComponent } from './components/tournament-management/tournament/tournament-webhook/tournament-webhook.component';
import { MappoolCreateComponent } from './components/tournament-management/mappool-create/mappool-create.component';
import { DeleteModBracketDialogComponent } from './components/dialogs/delete-mod-bracket-dialog/delete-mod-bracket-dialog.component';
import { TournamentOverviewComponent } from './components/tournament-management/tournament-overview/tournament-overview.component';
import { DeleteTournamentDialogComponent } from './components/dialogs/delete-tournament-dialog/delete-tournament-dialog.component';
import { PublishTournamentDialogComponent } from './components/dialogs/publish-tournament-dialog/publish-tournament-dialog.component';
import { TournamentEditComponent } from './components/tournament-management/tournament-edit/tournament-edit.component';
import { DeleteMappoolDialogComponent } from './components/dialogs/delete-mappool-dialog/delete-mappool-dialog.component';
import { TournamentParticipantsComponent } from './components/tournament-management/tournament/tournament-participants/tournament-participants.component';
import { DeleteTeamDialogComponent } from './components/dialogs/delete-team-dialog/delete-team-dialog.component';
import { TournamentAllPublishedComponent } from './components/tournament-management/tournament-all-published/tournament-all-published.component';
import { TournamentMyPublishedComponent } from './components/tournament-management/tournament-my-published/tournament-my-published.component';
import { TournamentCardComponent } from './components/tournament-management/tournament-card/tournament-card.component';
import { TournamentPublishedEditComponent } from './components/tournament-management/tournament-published-edit/tournament-published-edit.component';
import { TournamentAllPublishedAdministratorComponent } from './components/tournament-management/tournament-all-published-administrator/tournament-all-published-administrator.component';
import { IrcShortcutDialogComponent } from './components/dialogs/irc-shortcut-dialog/irc-shortcut-dialog.component';
import { TournamenStagesComponent } from './components/tournament-management/tournament/tournament-stages/tournament-stages.component';
import { DebugComponent } from './components/debug/debug.component';
import { IrcPickMapSameModBracketComponent } from './components/dialogs/irc-pick-map-same-mod-bracket/irc-pick-map-same-mod-bracket.component';
import { IrcShortcutWarningDialogComponent } from './components/dialogs/irc-shortcut-warning-dialog/irc-shortcut-warning-dialog.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		SidebarComponent,
		SettingsComponent,
		ErrorComponent,
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
		FilterTournamentPipe,
		SendBeatmapResultComponent,
		ReversePipe,
		TournamentComponent,
		TournamentCreateComponent,
		TournamentAddUserDialogComponent,
		MappoolComponent,
		ModBracketComponent,
		TournamentGeneralComponent,
		TournamentAccessComponent,
		TournamentWebhookComponent,
		MappoolCreateComponent,
		DeleteModBracketDialogComponent,
		TournamentOverviewComponent,
		DeleteTournamentDialogComponent,
		PublishTournamentDialogComponent,
		TournamentEditComponent,
		DeleteMappoolDialogComponent,
		TournamentParticipantsComponent,
		DeleteTeamDialogComponent,
		TournamentAllPublishedComponent,
		TournamentMyPublishedComponent,
		TournamentCardComponent,
		TournamentPublishedEditComponent,
		TournamentAllPublishedAdministratorComponent,
		IrcShortcutDialogComponent,
		TournamenStagesComponent,
		DebugComponent,
		IrcPickMapSameModBracketComponent,
		IrcShortcutWarningDialogComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AppRoutingModule,
		SharedModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})

export class AppModule {
	constructor() { }
}
