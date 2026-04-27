import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementRouterComponent } from './components/management-router/management-router.component';
import { TournamentAllPublishedAdministratorComponent } from './components/tournament-view/tournament-all-published-administrator/tournament-all-published-administrator.component';
import { TournamentAllPublishedComponent } from './components/tournament-view/tournament-all-published/tournament-all-published.component';
import { TournamentCreateComponent } from './pages/tournament-create/tournament-create.component';
import { TournamentMyPublishedComponent } from './components/tournament-view/tournament-my-published/tournament-my-published.component';
import { TournamentOverviewComponent } from './components/tournament-view/tournament-overview/tournament-overview.component';
import { TournamentEditComponent } from './components/tournament-manage/tournament-edit/tournament-edit.component';
import { LocalTournamentsComponent } from './pages/local-tournaments/local-tournaments.component';
import { PublishedTournamentsComponent } from './pages/published-tournaments/published-tournaments.component';

const routes: Routes = [
	{
		path: '', component: ManagementRouterComponent, children: [
			{ path: 'tournament-overview', component: TournamentOverviewComponent },
			{ path: 'tournament-overview/tournament-edit/:id/:published', component: TournamentEditComponent },
			{ path: 'tournament-overview/tournament-my-published', component: TournamentMyPublishedComponent },
			{ path: 'tournament-overview/tournament-all-published', component: TournamentAllPublishedComponent },
			{ path: 'tournament-overview/tournament-all-published-administrator', component: TournamentAllPublishedAdministratorComponent },

			{ path: 'local-tournaments', component: LocalTournamentsComponent },
			{ path: 'published-tournaments', component: PublishedTournamentsComponent },
			{ path: 'create', component: TournamentCreateComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TournamentManagementRoutingModule { }
