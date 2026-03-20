import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WybinScheduleRoutingModule } from './wybin-schedule-routing.module';
import { WybinScheduleComponent } from './components/wybin-schedule/wybin-schedule.component';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
	declarations: [
		WybinScheduleComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		WybinScheduleRoutingModule
	]
})
export class WybinScheduleModule { }
