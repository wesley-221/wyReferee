import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IrcRoutingModule } from './irc-routing.module';
import { IrcComponent } from 'app/modules/irc/components/irc/irc.component';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
	declarations: [
		IrcComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		IrcRoutingModule
	]
})
export class IrcModule { }
