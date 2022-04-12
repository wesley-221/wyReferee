import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationRoutingModule } from './information-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { InformationComponent } from './information/information.component';


@NgModule({
	declarations: [
		InformationComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		InformationRoutingModule
	]
})
export class InformationModule { }
