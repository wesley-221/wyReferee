import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { ErrorComponent } from './layout/error/error.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent,
		children: [
			{
				path: '', loadChildren: () =>
					import('./modules/information/information.module').then(m => m.InformationModule)
			},
			{
				path: 'information', loadChildren: () =>
					import('./modules/information/information.module').then(m => m.InformationModule)
			},
			{
				path: 'settings', loadChildren: () =>
					import('./modules/settings/settings.module').then(m => m.SettingsModule)
			},
			{
				path: 'lobby-overview', loadChildren: () =>
					import('./modules/lobby/lobby.module').then(m => m.LobbyModule)
			},
			{
				path: 'tournament-management', loadChildren: () =>
					import('./modules/tournament-management/tournament-management.module').then(m => m.TournamentManagementModule)
			},
			{
				path: 'axs', loadChildren: () =>
					import('./modules/axs/axs.module').then(m => m.AxsModule)
			},
			{
				path: 'irc', loadChildren: () =>
					import('./modules/irc/irc.module').then(m => m.IrcModule)
			},
			{ path: '**', component: ErrorComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})

export class AppRoutingModule { }
