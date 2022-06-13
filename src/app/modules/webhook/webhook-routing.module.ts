import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebhookComponent } from './components/webhook/webhook.component';

const routes: Routes = [
	{ path: '', component: WebhookComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class WebhookRoutingModule { }
