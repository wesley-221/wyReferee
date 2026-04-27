import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../../services/electron.service';
import { ToastService } from '../../../../services/toast.service';
import { ToastType } from '../../../../models/toast';
import { MatDialog } from '@angular/material/dialog';
import { RemoveSettingsComponent } from '../../../../components/dialogs/remove-settings/remove-settings.component';
import { AuthenticateService } from 'app/services/authenticate.service';
import { IrcService } from 'app/services/irc.service';
import { GenericService } from 'app/services/generic.service';
import { OptionsMenu } from '../../models/options-menu';
import { CacheStoreService } from 'app/services/storage/cache-store.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
	dialogMessage: string;

	axsMenuStatus: boolean;
	splitIrcMessages: boolean;

	generalOptions: OptionsMenu[] = [
		{ header: 'Show AxS menu item', description: 'Toggle visibility of the AxS menu item in the sidebar', buttonText: 'Toggle', action: () => this.toggleAxSMenu(), slideToggle: true, slideToggleValue: this.genericService.getAxSMenuStatus() }
	];

	configurationOptions: OptionsMenu[] = [
		{ header: 'Export data', description: 'Download all your data as a single ZIP file. Sensitive information, such as API keys and other credentials, are not included.', buttonText: 'Export', action: () => this.exportConfigFile() },
		{ header: 'Clear cache', description: 'Wipes all locally cached data.', buttonText: 'Clear cache', action: () => this.openDialog(0) },
		{ header: 'Remove API key', description: 'Removes your API key from the application.', buttonText: 'Remove', action: () => this.openDialog(1) }
	];

	constructor(
		public electronService: ElectronService,
		private toastService: ToastService,
		private dialog: MatDialog,
		public authService: AuthenticateService,
		public ircService: IrcService,
		private genericService: GenericService,
		private cacheStoreService: CacheStoreService
	) {
		this.genericService.getAxSMenuStatus().subscribe(status => {
			this.axsMenuStatus = status;
		});
	}

	ngOnInit() { }

	/**
	 * Clear the cache
	 */
	clearCache() {
		this.cacheStoreService.resetCache('beatmaps');
		this.cacheStoreService.resetCache('users');

		this.toastService.addToast('Successfully cleared the cache.');
	}

	/**
	 * Remove the pai key
	 */
	removeApiKey() {
		window.electronApi.osuAuthentication.clearApiKey();
		this.toastService.addToast('Successfully removed your api key.');
	}

	/**
	 * Export the config file
	 */
	exportConfigFile() {
		let fileName = 'wyReferee-settings.zip';

		if (this.authService.loggedIn) {
			const username = this.authService.loggedInUser.username.replace(/[^a-z0-9]/gi, '_').toLowerCase();
			fileName = `wyReferee-settings-${username}.zip`;
		}

		window.electronApi.dialog.showSaveDialog({
			title: 'Export wyReferee settings',
			defaultPath: fileName
		}).then(file => {
			if (file.canceled) {
				return;
			}

			window.electronApi.dialog.saveSettingsZip(file.filePath).then(() => {
				this.toastService.addToast(`Successfully saved the config files to "${file.filePath}".`);
			}).catch((err: Error) => {
				this.toastService.addToast(`Something went wrong while trying to export the config files: ${err.message}.`, ToastType.Error);
			});
		});
	}

	openDialog(dialogAction: number) {
		let dialogMessage: string = null;

		if (dialogAction == 0) {
			dialogMessage = 'Are you sure you want to clear your cache?';
		}
		else if (dialogAction == 1) {
			dialogMessage = 'Are you sure you want to remove your api key?';
		}

		const dialogRef = this.dialog.open(RemoveSettingsComponent, {
			data: {
				message: dialogMessage
			}
		});

		dialogRef.afterClosed().subscribe(res => {
			if (res == true) {
				if (dialogAction == 0) {
					this.clearCache();
				}
				else if (dialogAction == 1) {
					this.removeApiKey();
				}
			}
		});
	}

	toggleAxSMenu(): void {
		this.axsMenuStatus = !this.axsMenuStatus;
		this.genericService.setAxSMenu(this.axsMenuStatus);
	}
}
