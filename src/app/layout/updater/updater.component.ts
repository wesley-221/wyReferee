import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProgressInfo } from 'electron-updater';
import { AppConfig } from 'environments/environment';

@Component({
	selector: 'app-updater',
	templateUrl: './updater.component.html',
	styleUrls: ['./updater.component.scss']
})
export class UpdaterComponent implements OnInit {
	isProduction = AppConfig.production;

	updateWasFound = false;
	downloadPercentage = 0;

	constructor(private ref: ChangeDetectorRef) {
		if (!this.isProduction) {
			return;
		}

		window.electronApi.autoUpdater.checkForUpdatesAndNotify();
	}

	ngOnInit(): void {
		window.electronApi.autoUpdater.updateAvailable(() => {
			this.updateWasFound = true;
			this.downloadPercentage = 0;

			this.ref.detectChanges();
		});

		window.electronApi.autoUpdater.updateDownloaded(() => {
			this.ref.detectChanges();

			setTimeout(() => {
				window.electronApi.autoUpdater.restartAppAfterUpdateDownload();
			}, 10000);
		});

		window.electronApi.autoUpdater.updateDownloadProgress((progress: ProgressInfo) => {
			this.downloadPercentage = Number(progress.percent.toFixed(2));
			this.ref.detectChanges();
		});

		window.electronApi.autoUpdater.onUpdateError((error: string) => {
			console.error(`Update error: ${error}`);
		});
	}
}
