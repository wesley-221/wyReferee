import { Component } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { StoreService } from './services/store.service';
import { ToastService } from './services/toast.service';
import { ToastType } from './models/toast';
import { IrcService } from './services/irc.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(public electronService: ElectronService, private storeService: StoreService, private toastService: ToastService, private ircService: IrcService) {
		const apiKey = storeService.get('api-key');

		// Check if the api key is set
		if (apiKey == undefined || apiKey == '') {
			toastService.addToast('The api key wasn\'t set, make sure to set the api key before continuing.', ToastType.Error, 20);
		}
	}
}
