import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorialRoutingModule } from './tutorial-routing.module';
import { TutorialComponent } from './components/tutorial/tutorial.component';


@NgModule({
	declarations: [
		TutorialComponent
	],
	imports: [
		CommonModule,
		TutorialRoutingModule
	]
})
export class TutorialModule { }
