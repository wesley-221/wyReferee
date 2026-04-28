import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './components/account/account.component';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
	declarations: [
		AccountComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		AccountRoutingModule
	]
})
export class AccountModule { }
