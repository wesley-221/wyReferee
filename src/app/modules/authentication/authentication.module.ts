import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
	declarations: [
		AuthenticationComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		AuthenticationRoutingModule
	]
})
export class AuthenticationModule { }
