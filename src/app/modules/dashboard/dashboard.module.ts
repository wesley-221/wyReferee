import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';


@NgModule({
	declarations: [
		DashboardComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		DashboardRoutingModule
	]
})
export class DashboardModule { }
