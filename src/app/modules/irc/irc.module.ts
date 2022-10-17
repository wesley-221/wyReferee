import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IrcRoutingModule } from './irc-routing.module';
import { IrcComponent } from 'app/modules/irc/components/irc/irc.component';
import { SharedModule } from 'app/shared/shared.module';
import { IrcShortcutCommandsComponent } from './components/irc-shortcut-commands/irc-shortcut-commands.component';
import { IrcPlayerManagementComponent } from './components/irc-player-management/irc-player-management.component';


@NgModule({
	declarations: [
		IrcComponent,
		IrcShortcutCommandsComponent,
		IrcPlayerManagementComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		IrcRoutingModule
	]
})
export class IrcModule { }
