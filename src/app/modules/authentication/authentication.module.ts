import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './components/authentication/authentication.component';


@NgModule({
	declarations: [
		AuthenticationComponent
	],
	imports: [
		CommonModule,
		AuthenticationRoutingModule
	]
})
export class AuthenticationModule { }
