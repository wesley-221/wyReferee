import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { AxSRoutingModule } from './axs-routing.module';
import { AxsCalculatorComponent } from './components/axs-calculator/axs-calculator.component';
import { AxsFormulaComponent } from './components/axs-formula/axs-formula.component';
import { AxsInformationComponent } from './components/axs-information/axs-information.component';
import { AxsRouterComponent } from './components/axs-router/axs-router.component';

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
