import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementRouterComponent } from './components/management-router/management-router.component';
import { TournamentAllPublishedAdministratorComponent } from './components/tournament-view/tournament-all-published-administrator/tournament-all-published-administrator.component';
import { TournamentAllPublishedComponent } from './components/tournament-view/tournament-all-published/tournament-all-published.component';
import { TournamentCreateComponent } from './components/tournament-manage/tournament-create/tournament-create.component';
import { TournamentEditComponent } from './components/tournament-manage/tournament-edit/tournament-edit.component';
import { TournamentMyPublishedComponent } from './components/tournament-view/tournament-my-published/tournament-my-published.component';
import { TournamentOverviewComponent } from './components/tournament-view/tournament-overview/tournament-overview.component';
import { TournamentPublishedEditComponent } from './components/tournament-manage/tournament-published-edit/tournament-published-edit.component';

const routes: Routes = [
	{
		path: '', component: ManagementRouterComponent, children: [
			{ path: 'tournament-overview', component: TournamentOverviewComponent },
			{ path: 'tournament-overview/tournament-create', component: TournamentCreateComponent },
			{ path: 'tournament-overview/tournament-edit/:id', component: TournamentEditComponent },
			{ path: 'tournament-overview/tournament-my-published/tournament-published-edit/:id', component: TournamentPublishedEditComponent },
			{ path: 'tournament-overview/tournament-my-published', component: TournamentMyPublishedComponent },
			{ path: 'tournament-overview/tournament-all-published', component: TournamentAllPublishedComponent },
			{ path: 'tournament-overview/tournament-all-published-administrator', component: TournamentAllPublishedAdministratorComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TournamentManagementRoutingModule { }
