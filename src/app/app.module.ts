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
import { MappoolBracketEditComponent } from './components/mappool/mappool-bracket-edit/mappool-bracket-edit.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { AuthInterceptor } from "./components/authentication/token-interceptor";
import { IrcComponent } from './components/irc/irc.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { SearchPipe } from './pipes/search.pipe';

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
		MappoolBracketEditComponent, 
		LoginComponent, 
		IrcComponent, 
		SearchPipe
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
