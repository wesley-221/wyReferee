import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';
import { TitlebarComponent } from './components/main-page/titlebar/titlebar.component';
import { MainComponent } from './components/main-page/main/main.component';
import { SidebarComponent } from './components/main-page/sidebar/sidebar.component';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorComponent } from './components/main-page/error/error.component';
import { InformationComponent } from './components/information/information.component';
import { ToastComponent } from './components/main-page/toast/toast.component';
import { AllLobbiesComponent } from './components/lobby/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/lobby/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby/lobby-view/lobby-view.component';
import { MappoolOverviewComponent } from './components/mappool/mappool-overview/mappool-overview.component';
import { MappoolCreateComponent } from './components/mappool/mappool-create/mappool-create.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthInterceptor } from "./components/authentication/token-interceptor";
import { IrcComponent } from './components/irc/irc.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { SearchPipe } from './pipes/search.pipe';
import { RegisterComponent } from './components/authentication/register/register.component';
import { TournamentCreateComponent } from './components/tournament/tournament-create/tournament-create.component';
import { TournamentOverviewComponent } from './components/tournament/tournament-overview/tournament-overview.component';
import { TournamentEditComponent } from './components/tournament/tournament-edit/tournament-edit.component';
import { TournamentComponent } from './components/tournament/tournament/tournament.component';
import { ModBracketComponent } from './components/mappool/mod-bracket/mod-bracket.component';
import { MyPublishedMappoolsComponent } from './components/mappool/my-published-mappools/my-published-mappools.component';
import { MappoolSummaryComponent } from './components/mappool/mappool-summary/mappool-summary.component';
import { MappoolEditComponent } from './components/mappool/mappool-edit/mappool-edit.component';
import { MappoolComponent } from './components/mappool/mappool/mappool.component';
import { TournamentSummaryComponent } from './components/tournament/tournament-summary/tournament-summary.component';
import { MyPublishedTournamentsComponent } from './components/tournament/my-published-tournaments/my-published-tournaments.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		AppComponent,
		TitlebarComponent,
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
		LoginComponent,
		IrcComponent,
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
		MyPublishedTournamentsComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		AppRoutingModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		FontAwesomeModule,
		DragDropModule,
		VirtualScrollerModule,
		BrowserAnimationsModule,
		ClipboardModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})

export class AppModule {
	constructor(library: FaIconLibrary) {
		library.addIconPacks(fas, far);
	}
}
