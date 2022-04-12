import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastService } from 'app/services/toast.service';
import { AppConfig } from 'environments/environment';

@Component({
	selector: 'app-updater',
	templateUrl: './updater.component.html',
	styleUrls: ['./updater.component.scss']
})
export class UpdaterComponent implements OnInit {
	remote: any;
	autoUpdater: any;

	updateWasFound = false;
	downloadPercentage = 0;

	constructor(private ref: ChangeDetectorRef, private toastService: ToastService) {
		const log = require('electron-log');

		this.remote = window.require('electron').remote;
		this.autoUpdater = this.remote.require('electron-updater').autoUpdater;

		// TODO: Enable this once useAppSupportCache has been fixed
		// See https://github.com/imjsElectron/electron-differential-updater/issues/18
		// this.autoUpdater = this.remote.require('@imjs/electron-differential-updater').autoUpdater;

		log.transports.file.level = 'debug';
		this.autoUpdater.logger = log;

		this.autoUpdater.autoDownload = true;

		if (AppConfig.production) {
			this.autoUpdater.checkForUpdates();

			this.autoUpdater.on('error', (err: string) => {
				toastService.addToast(`Something went wrong while trying to update: ${err}`);
			});

			this.autoUpdater.on('update-available', () => {
				toastService.addToast('An update was found, the download will now start!');
				this.updateWasFound = true;
			});

			// TODO: See TODO above
			// this.autoUpdater.on('download-progress', (progress: ElectronDownloadProgression) => {
			// 	this.downloadPercentage = Math.round(progress.percent);
			// 	ref.detectChanges();
			// });

			this.autoUpdater.on('update-downloaded', () => {
				// TODO: Remove this, see TODO above
				toastService.addToast('The update has been downloaded and will be installed in 10 seconds. If you close the client, it will install the update right away.');

				setTimeout(() => {
					this.autoUpdater.quitAndInstall();
				}, 10000);
			});
		}
	}

	ngOnInit(): void { }
}
