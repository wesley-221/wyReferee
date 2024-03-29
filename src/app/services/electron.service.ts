import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, shell, dialog } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

import { ToastService } from './toast.service';

@Injectable({
	providedIn: 'root'
})

export class ElectronService {
	ipcRenderer: typeof ipcRenderer;
	webFrame: typeof webFrame;
	remote: typeof remote;
	childProcess: typeof childProcess;
	fs: typeof fs;
	shell: typeof shell;
	dialog: typeof dialog;

	constructor(private toastService: ToastService) {
		// Conditional imports
		if (this.isElectron) {
			this.ipcRenderer = window.require('electron').ipcRenderer;
			this.webFrame = window.require('electron').webFrame;
			this.remote = window.require('electron').remote;
			this.shell = window.require('electron').shell;
			this.dialog = this.remote.dialog;

			this.childProcess = window.require('child_process');
			this.fs = window.require('fs');
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
