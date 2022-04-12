import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AxsCalculatorComponent } from './components/axs-calculator/axs-calculator.component';
import { AxsFormulaComponent } from './components/axs-formula/axs-formula.component';
import { AxsInformationComponent } from './components/axs-information/axs-information.component';
import { AxsRouterComponent } from './components/axs-router/axs-router.component';

const routes: Routes = [
	{
		path: '', component: AxsRouterComponent, children: [
			{ path: 'information', component: AxsInformationComponent },
			{ path: 'manual-calculator', component: AxsCalculatorComponent },
			{ path: 'axs-formula', component: AxsFormulaComponent },
			{ path: '**', component: AxsInformationComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AxSRoutingModule { }
