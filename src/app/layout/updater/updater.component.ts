import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConfig } from 'environments/environment';
import { NewUpdateDialogComponent } from '../../components/dialogs/new-update-dialog/new-update-dialog.component';
import PackageJson from '../../../../package.json';

@Component({
	selector: 'app-updater',
	templateUrl: './updater.component.html',
	styleUrls: ['./updater.component.scss']
})
export class UpdaterComponent implements OnInit {
	isProduction = AppConfig.production;
	currentVersion = PackageJson.version;

	updateWasFound = false;
	downloadPercentage = 0;

	constructor(private dialog: MatDialog) {
		if (!this.isProduction) {
			return;
		}

		window.electronApi.autoUpdater.checkForUpdates();
	}

	ngOnInit(): void {
		window.electronApi.autoUpdater.updateAvailable((info) => {
			this.dialog.open(NewUpdateDialogComponent, {
				disableClose: true,
				width: '620px',
				maxWidth: 'calc(100vw - 40px)',
				data: {
					info: info,
					currentVersion: this.currentVersion
				}
			});
		});
	}
}
