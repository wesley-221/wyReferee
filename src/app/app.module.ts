import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [AppComponent, TitlebarComponent, MainComponent, SidebarComponent, SettingsComponent, ErrorComponent, InformationComponent],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		AppRoutingModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		FontAwesomeModule
	],
	providers: [],
	bootstrap: [AppComponent]
})

export class AppModule {
	constructor(library: FaIconLibrary) {
		library.addIconPacks(fas, far);
	}
}
