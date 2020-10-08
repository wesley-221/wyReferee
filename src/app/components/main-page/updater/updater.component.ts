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

	updateWasFound: boolean = false;
	downloadPercentage: number = 0;

	constructor(private ref: ChangeDetectorRef, private toastService: ToastService) {
		const log = require('electron-log');

		this.remote = window.require('electron').remote;
		this.autoUpdater = this.remote.require('@imjs/electron-differential-updater').autoUpdater;

		log.transports.file.level = 'debug';
		this.autoUpdater.logger = log;

		this.autoUpdater.autoDownload = true;

		if (AppConfig.production) {
			this.autoUpdater.checkForUpdates();

			this.autoUpdater.on('error', (err: any) => {
				toastService.addToast(`Something went wrong while trying to update: ${err}`);
			});

			this.autoUpdater.on('update-available', () => {
				this.updateWasFound = true;
			});

			this.autoUpdater.on('download-progress', (progress: ElectronDownloadProgression) => {
				this.downloadPercentage = Math.round(progress.percent);
				ref.detectChanges();
			});

			this.autoUpdater.on('update-downloaded', () => {
				setTimeout(() => {
					this.autoUpdater.quitAndInstall();
				}, 10000);
			});
		}
	}

	ngOnInit(): void { }
}
