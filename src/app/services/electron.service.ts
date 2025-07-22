import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ElectronService {
	constructor() { }

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
