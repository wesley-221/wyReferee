import { Injectable } from '@angular/core';
import { remote } from 'electron';

@Injectable({
	providedIn: 'root'
})

export class ElectronService {
	remote: typeof remote;

	constructor() {
		if (this.isElectron) {
			this.remote = window.require('electron').remote;
		}
	}

	get isElectron() {
		return window && window.process && window.process.type;
	}

	/**
	 * Open a link in the default browser
	 *
	 * @param url the url to open in the default browser
	 */
	openLink(url: string): void {
		window.electronApi.openLink(url);
	}
}
