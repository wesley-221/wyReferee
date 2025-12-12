import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorComponent } from './layout/error/error.component';
import { RemoveSettingsComponent } from './components/dialogs/remove-settings/remove-settings.component';
import { DeleteLobbyComponent } from './components/dialogs/delete-lobby/delete-lobby.component';
import { MultiplayerLobbySettingsComponent } from './components/dialogs/multiplayer-lobby-settings/multiplayer-lobby-settings.component';
import { JoinIrcChannelComponent } from './components/dialogs/join-irc-channel/join-irc-channel.component';
import { BanBeatmapComponent } from './components/dialogs/ban-beatmap/ban-beatmap.component';
import { MultiplayerLobbyMovePlayerComponent } from './components/dialogs/multiplayer-lobby-move-player/multiplayer-lobby-move-player.component';
import { SendBeatmapResultComponent } from './components/dialogs/send-beatmap-result/send-beatmap-result.component';
import { TournamentAddUserDialogComponent } from './components/dialogs/tournament-add-user-dialog/tournament-add-user-dialog.component';
import { DeleteModBracketDialogComponent } from './components/dialogs/delete-mod-bracket-dialog/delete-mod-bracket-dialog.component';
import { DeleteTournamentDialogComponent } from './components/dialogs/delete-tournament-dialog/delete-tournament-dialog.component';
import { PublishTournamentDialogComponent } from './components/dialogs/publish-tournament-dialog/publish-tournament-dialog.component';
import { DeleteMappoolDialogComponent } from './components/dialogs/delete-mappool-dialog/delete-mappool-dialog.component';
import { DeleteTeamDialogComponent } from './components/dialogs/delete-team-dialog/delete-team-dialog.component';
import { IrcShortcutDialogComponent } from './components/dialogs/irc-shortcut-dialog/irc-shortcut-dialog.component';
import { IrcPickMapSameModBracketComponent } from './components/dialogs/irc-pick-map-same-mod-bracket/irc-pick-map-same-mod-bracket.component';
import { IrcShortcutWarningDialogComponent } from './components/dialogs/irc-shortcut-warning-dialog/irc-shortcut-warning-dialog.component';
import { SharedModule } from './shared/shared.module';
import { MainComponent } from './layout/main/main.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { UpdaterComponent } from './layout/updater/updater.component';
import { MarkdownModule } from 'ngx-markdown';
import { credentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { ProtectBeatmapDialogComponent } from './components/dialogs/protect-beatmap-dialog/protect-beatmap-dialog.component';
import { AddBulkTeamsDialogComponent } from './components/dialogs/add-bulk-teams-dialog/add-bulk-teams-dialog.component';
import { StorageDriverService } from './services/storage/storage-driver.service';
import { DataMigrationDialogComponent } from './components/dialogs/data-migration-dialog/data-migration-dialog.component';
import { UpdateMatchResultsDialogComponent } from './components/dialogs/update-match-results-dialog/update-match-results-dialog.component';

export function initStorage(storageDriver: StorageDriverService) {
	return () => storageDriver.init();
}

@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		SidebarComponent,
		ErrorComponent,
		RemoveSettingsComponent,
		DeleteLobbyComponent,
		MultiplayerLobbySettingsComponent,
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
		IrcPickMapSameModBracketComponent,
		IrcShortcutWarningDialogComponent,
		ProtectBeatmapDialogComponent,
		AddBulkTeamsDialogComponent,
		DataMigrationDialogComponent,
		UpdateMatchResultsDialogComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		MarkdownModule.forRoot(),
		SharedModule
	],
	providers: [
		provideHttpClient(
			withInterceptors([
				credentialsInterceptor
			])
		),
		{ provide: APP_INITIALIZER, useFactory: initStorage, deps: [StorageDriverService], multi: true }
	],
	bootstrap: [AppComponent]
})

export class AppModule {
	constructor() { }
}
