import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { ErrorComponent } from './layout/error/error.component';

const routes: Routes = [
	{
		path: 'irc', loadChildren: () =>
			import('./modules/irc/irc.module').then(m => m.IrcModule)
	},
	{
		path: '',
		component: MainComponent,
		children: [
			{
				path: '', redirectTo: 'dashboard', pathMatch: 'full'
			},
			{
				path: 'dashboard', loadChildren: () =>
					import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'account', loadChildren: () =>
					import('./modules/account/account.module').then(m => m.AccountModule)
			},
			{
				path: 'tutorial', loadChildren: () =>
					import('./modules/tutorial/tutorial.module').then(m => m.TutorialModule)
			},
			{
				path: 'changelog', loadChildren: () =>
					import('./modules/changelog/changelog.module').then(m => m.ChangelogModule)
			},
			{
				path: 'settings', loadChildren: () =>
					import('./modules/settings/settings.module').then(m => m.SettingsModule)
			},
			{
				path: 'wybin-schedule', loadChildren: () =>
					import('./modules/wybin-schedule/wybin-schedule.module').then(m => m.WybinScheduleModule)
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
			{ path: '**', component: ErrorComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})

export class AppRoutingModule { }
