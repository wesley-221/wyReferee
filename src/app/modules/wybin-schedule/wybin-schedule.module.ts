import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WybinScheduleRoutingModule } from './wybin-schedule-routing.module';
import { WybinScheduleComponent } from './components/wybin-schedule/wybin-schedule.component';


@NgModule({
	declarations: [
		WybinScheduleComponent
	],
	imports: [
		CommonModule,
		WybinScheduleRoutingModule
	]
})
export class WybinScheduleModule { }
