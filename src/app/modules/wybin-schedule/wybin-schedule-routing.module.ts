import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WybinScheduleComponent } from './components/wybin-schedule/wybin-schedule.component';

const routes: Routes = [
	{ path: '', component: WybinScheduleComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class WybinScheduleRoutingModule { }
