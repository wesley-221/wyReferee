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
import { RegisterComponent } from './components/register/register.component';
import { RemoveSettingsComponent } from './components/dialogs/remove-settings/remove-settings.component';
import { DeleteLobbyComponent } from './components/dialogs/delete-lobby/delete-lobby.component';
import { MultiplayerLobbySettingsComponent } from './components/dialogs/multiplayer-lobby-settings/multiplayer-lobby-settings.component';
import { SendFinalResultComponent } from './components/dialogs/send-final-result/send-final-result.component';
import { JoinIrcChannelComponent } from './components/dialogs/join-irc-channel/join-irc-channel.component';
import { BanBeatmapComponent } from './components/dialogs/ban-beatmap/ban-beatmap.component';
import { MultiplayerLobbyMovePlayerComponent } from './components/dialogs/multiplayer-lobby-move-player/multiplayer-lobby-move-player.component';
import { UpdaterComponent } from './components/main-page/updater/updater.component';
import { SendBeatmapResultComponent } from './components/dialogs/send-beatmap-result/send-beatmap-result.component';
import { TournamentAddUserDialogComponent } from './components/dialogs/tournament-add-user-dialog/tournament-add-user-dialog.component';
import { DeleteModBracketDialogComponent } from './components/dialogs/delete-mod-bracket-dialog/delete-mod-bracket-dialog.component';
import { DeleteTournamentDialogComponent } from './components/dialogs/delete-tournament-dialog/delete-tournament-dialog.component';
import { PublishTournamentDialogComponent } from './components/dialogs/publish-tournament-dialog/publish-tournament-dialog.component';
import { DeleteMappoolDialogComponent } from './components/dialogs/delete-mappool-dialog/delete-mappool-dialog.component';
import { DeleteTeamDialogComponent } from './components/dialogs/delete-team-dialog/delete-team-dialog.component';
import { IrcShortcutDialogComponent } from './components/dialogs/irc-shortcut-dialog/irc-shortcut-dialog.component';
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
		RegisterComponent,
		RemoveSettingsComponent,
		DeleteLobbyComponent,
		MultiplayerLobbySettingsComponent,
		SendFinalResultComponent,
		JoinIrcChannelComponent,
		BanBeatmapComponent,
		MultiplayerLobbyMovePlayerComponent,
		UpdaterComponent,
		SendBeatmapResultComponent,
		TournamentAddUserDialogComponent,
		DeleteModBracketDialogComponent,
		DeleteTournamentDialogComponent,
		PublishTournamentDialogComponent,
		DeleteMappoolDialogComponent,
		DeleteTeamDialogComponent,
		IrcShortcutDialogComponent,
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
