import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { INewUpdateDialogData } from '../../../interfaces/i-new-update-dialog-data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { UpdaterComponent } from '../../../layout/updater/updater.component';
import { ProgressInfo } from 'electron-updater';

@Component({
	selector: 'app-new-update-dialog',
	templateUrl: './new-update-dialog.component.html',
	styleUrl: './new-update-dialog.component.scss'
})
export class NewUpdateDialogComponent {
	private readonly GIT_RELEASE_URL = AppConfig.links.githubApiReleases;

	githubUrl: string;
	fileSizeInMB: number;
	downloadStatus: 'idle' | 'downloading' | 'completed' | 'error';

	changelog$: Observable<string>;
	downloadProgressInfo$: Observable<ProgressInfo>;

	constructor(@Inject(MAT_DIALOG_DATA) public data: INewUpdateDialogData, private http: HttpClient, private dialog: MatDialogRef<UpdaterComponent>, private ref: ChangeDetectorRef) {
		const fileSizeMB = data.info.files.reduce((total, file) => total + file.size, 0) / (1024 * 1024);
		this.fileSizeInMB = fileSizeMB;
		this.downloadStatus = 'idle';

		this.changelog$ = this.http.get(`${this.GIT_RELEASE_URL}/tags/${this.data.info.version}`, {
			headers: {
				"Accept": "application/vnd.github+json"
			}
		}).pipe(
			map((release: any) => {
				let body = release.body;

				return body.replace(/@([a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})/gi,
					(match: string) => `[${match}](https://github.com/${match.substring(1)})`
				);
			})
		);

		this.downloadProgressInfo$ = new Observable<ProgressInfo>((observer) => {
			observer.next({
				percent: 0,
				bytesPerSecond: 0,
				transferred: 0,
				total: 0,
				delta: 0
			});

			window.electronApi.autoUpdater.updateDownloadProgress((progressInfo: ProgressInfo) => {
				observer.next(progressInfo);
			});
		});

		window.electronApi.autoUpdater.onUpdateError((error: string) => {
			console.error(`Update error: ${error}`);
		});

		window.electronApi.autoUpdater.updateDownloaded(() => {
			this.downloadStatus = 'completed';

			setTimeout(() => {
				window.electronApi.autoUpdater.restartAppAfterUpdateDownload();
				this.dialog.close();
			}, 10 * 1000);

			this.ref.detectChanges();
		});
	}

	onLaterClick(): void {
		this.dialog.close();
	}

	onDownloadClick(): void {
		this.downloadStatus = 'downloading';

		window.electronApi.autoUpdater.downloadUpdate();
	}

	onRestartAndInstallClick(): void {
		window.electronApi.autoUpdater.restartAppAfterUpdateDownload();
	}
}
