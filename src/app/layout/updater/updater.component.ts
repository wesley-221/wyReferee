import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProgressInfo } from 'electron-updater';

@Component({
	selector: 'app-updater',
	templateUrl: './updater.component.html',
	styleUrls: ['./updater.component.scss']
})
export class UpdaterComponent implements OnInit {
	updateWasFound = false;
	downloadPercentage = 0;

	constructor(private ref: ChangeDetectorRef) {
		window.electronApi.checkForUpdatesAndNotify();

		window.electronApi.updateAvailable(() => {
			this.updateWasFound = true;
			this.downloadPercentage = 0;

			this.ref.detectChanges();
		});

		window.electronApi.updateDownloaded(() => {
			this.ref.detectChanges();

			setTimeout(() => {
				window.electronApi.restartAppAfterUpdateDownload();
			}, 10000);
		});

		window.electronApi.updateDownloadProgress((progress: ProgressInfo) => {
			console.log(progress);

			this.downloadPercentage = progress.percent;
			this.ref.detectChanges();
		});

		window.electronApi.onUpdateError((error: string) => {
			console.error(`Update error: ${error}`);
		});
	}

	ngOnInit(): void { }
}
