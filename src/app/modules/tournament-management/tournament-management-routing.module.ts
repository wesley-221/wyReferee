import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementRouterComponent } from './components/management-router/management-router.component';
import { AdministratorTournamentsComponent } from './pages/administrator-tournaments/administrator-tournaments.component';
import { ImportTournamentComponent } from './pages/import-tournament/import-tournament.component';
import { TournamentCreateComponent } from './pages/tournament-create/tournament-create.component';
import { TournamentEditComponent } from './components/tournament-manage/tournament-edit/tournament-edit.component';
import { LocalTournamentsComponent } from './pages/local-tournaments/local-tournaments.component';
import { PublishedTournamentsComponent } from './pages/published-tournaments/published-tournaments.component';

const routes: Routes = [
	{
		path: '', component: ManagementRouterComponent, children: [
			{ path: 'tournament-overview/tournament-edit/:id/:published', component: TournamentEditComponent },

			{ path: 'local-tournaments', component: LocalTournamentsComponent },
			{ path: 'published-tournaments', component: PublishedTournamentsComponent },
			{ path: 'create', component: TournamentCreateComponent },
			{ path: 'import-tournament', component: ImportTournamentComponent },
			{ path: 'administrator-tournaments', component: AdministratorTournamentsComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TournamentManagementRoutingModule { }
