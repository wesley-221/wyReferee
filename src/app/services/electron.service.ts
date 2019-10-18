import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, shell, dialog } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { AppConfig } from '../../environments/environment';
import { ToastService } from './toast.service';
import { ToastType } from '../models/toast';

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

	autoUpdater: typeof autoUpdater;
	log: typeof log;
  
	get isElectron() {
	  	return window && window.process && window.process.type;
	}
  
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

			// Autoupdater
			this.autoUpdater = this.remote.require('electron-updater').autoUpdater;
			this.log = this.remote.require('electron-log');
			this.log.info('App starting');

			this.autoUpdater.logger = this.log;
			(<any>this.autoUpdater.logger).transports.file.level = 'info';
			this.autoUpdater.autoDownload = true;

			if(AppConfig.production) {
				this.autoUpdater.checkForUpdates();

				this.autoUpdater.on('checking-for-updates', () => {
					console.log('Checking for updates');
				});

				this.autoUpdater.on('update-not-available', () => {
					console.log('No updates were found');
				});

				this.autoUpdater.on('update-available', () => {
					toastService.addToast('A new update is available. The download will start in the background.');
				});

				this.autoUpdater.on('error', err => {
					toastService.addToast(`Something went wrong while trying to update: ${err}`);
				});

				this.autoUpdater.on('update-downloaded', info => {
					toastService.addToast('The update has been downloaded and will be installed in 10 seconds. If you close the program immediately, it will install the update right away.', ToastType.Information, 10);

					setTimeout(() => {
						this.autoUpdater.quitAndInstall();
					}, 10000);
				});
			}
		}
	}

	/**
	 * Open a link in the default browser
	 * @param link the url to open in the default browser
	 */
	openLink(link: string): void {
		shell.openExternal(link);
	}
}
