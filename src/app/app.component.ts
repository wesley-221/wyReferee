import { Component } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { ToastService } from './services/toast.service';
import { IrcService } from './services/irc.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(public electronService: ElectronService, private toastService: ToastService, private ircService: IrcService) { }
}
