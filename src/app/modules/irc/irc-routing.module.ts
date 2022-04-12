import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IrcComponent } from 'app/modules/irc/components/irc/irc.component';

const routes: Routes = [
	{ path: '', component: IrcComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class IrcRoutingModule { }
