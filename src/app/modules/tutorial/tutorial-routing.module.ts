import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialOverviewComponent } from './components/tutorial-overview/tutorial-overview.component';

const routes: Routes = [
	{ path: '', component: TutorialOverviewComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TutorialRoutingModule { }
