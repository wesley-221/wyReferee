import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, remote, shell } from 'electron';

@Injectable({
	providedIn: 'root'
})

export class ElectronService {
	ipcRenderer: typeof ipcRenderer;
	remote: typeof remote;

	constructor() {
		// Conditional imports
		if (this.isElectron) {
			this.ipcRenderer = window.require('electron').ipcRenderer;
			this.remote = window.require('electron').remote;
		}
	}

	get isElectron() {
		return window && window.process && window.process.type;
	}

	/**
	 * Open a link in the default browser
	 *
	 * @param link the url to open in the default browser
	 */
	openLink(link: string): void {
		shell.openExternal(link);
	}
}
