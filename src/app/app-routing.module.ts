import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main-page/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorComponent } from './components/main-page/error/error.component';
import { InformationComponent } from './components/information/information.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent, 
		children: [
			{ path: '', component: InformationComponent },
			{ path: 'information', component: InformationComponent },
			{ path: 'settings', component: SettingsComponent}, 
			{ path: '**', component: ErrorComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})

export class AppRoutingModule {}
