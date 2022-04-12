import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { AxsCalculatorComponent } from './axs-calculator/axs-calculator.component';
import { AxsFormulaComponent } from './axs-formula/axs-formula.component';
import { AxsInformationComponent } from './axs-information/axs-information.component';
import { AxsRouterComponent } from './axs-router/axs-router.component';
import { AxSRoutingModule } from './axs-routing.module';

@NgModule({
	declarations: [
		AxsCalculatorComponent,
		AxsFormulaComponent,
		AxsInformationComponent,
		AxsRouterComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		AxSRoutingModule
	]
})
export class AxsModule { }
