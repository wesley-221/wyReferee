import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialComponent } from './components/tutorial/tutorial.component';

const routes: Routes = [
	{ path: '', component: TutorialComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TutorialRoutingModule { }
