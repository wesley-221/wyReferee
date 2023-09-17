import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorialRoutingModule } from './tutorial-routing.module';
import { TutorialOverviewComponent } from './components/tutorial-overview/tutorial-overview.component';

@NgModule({
	declarations: [
		TutorialOverviewComponent
	],
	imports: [
		CommonModule,
		TutorialRoutingModule
	]
})
export class TutorialModule { }
