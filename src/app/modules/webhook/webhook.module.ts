import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebhookRoutingModule } from './webhook-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { WebhookComponent } from './components/webhook/webhook.component';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
	declarations: [
		WebhookComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		WebhookRoutingModule,
		MarkdownModule.forChild()
	]
})
export class WebhookModule { }
