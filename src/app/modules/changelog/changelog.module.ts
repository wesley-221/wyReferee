import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangelogRoutingModule } from './changelog-routing.module';
import { ChangelogComponent } from './components/changelog/changelog.component';
import { SharedModule } from 'app/shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
	declarations: [
		ChangelogComponent
	],
	imports: [
		CommonModule,
		ChangelogRoutingModule,
		MarkdownModule.forChild(),
		SharedModule
	]
})
export class ChangelogModule { }
