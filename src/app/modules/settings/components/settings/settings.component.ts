import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../../services/electron.service';
import { StoreService } from '../../../../services/store.service';
import { ToastService } from '../../../../services/toast.service';
import { ToastType } from '../../../../models/toast';
import { MatDialog } from '@angular/material/dialog';
import { RemoveSettingsComponent } from '../../../../components/dialogs/remove-settings/remove-settings.component';
import { AuthenticateService } from 'app/services/authenticate.service';
import { IrcService } from 'app/services/irc.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GenericService } from 'app/services/generic.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
	dialogMessage: string;
	dialogAction = 0;

	axsMenuStatus: boolean;
	splitIrcMessages: boolean;

	allOptions: { icon: string; message: string; buttonText: string; action: any }[] = [
		{ icon: 'settings', message: 'This will export the config file and save it as a file in case you need to share it with someone. <br /><b>Note:</b> This will not export any authentication data such as login information or API keys <br />', buttonText: 'Export config file', action: () => this.exportConfigFile() },
		{ icon: 'cached', message: 'This will clear all the cache.', buttonText: 'Clear cache', action: () => this.openDialog(0) },
		{ icon: 'api', message: 'This will remove the API key.', buttonText: 'Remove API key', action: () => this.openDialog(1) },
		{ icon: 'settings', message: 'Show or hide the AxS menu item.', buttonText: 'Toggle', action: () => this.toggleAxSMenu() }
	];

	constructor(
		public electronService: ElectronService,
		private storeService: StoreService,
		private toastService: ToastService,
		private dialog: MatDialog,
		public authService: AuthenticateService,
		public ircService: IrcService,
		private genericService: GenericService
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
		this.storeService.delete('cache');
		this.toastService.addToast('Successfully cleared the cache.');
	}

	/**
	 * Remove the pai key
	 */
	removeApiKey() {
		this.storeService.delete('api-key');
		this.toastService.addToast('Successfully removed your api key.');
	}

	/**
	 * Export the config file
	 */
	exportConfigFile() {
		this.electronService.dialog.showSaveDialog({
			title: 'Export the config file',
			defaultPath: 'export.json'
		}).then(file => {
			// Remove the api key and auth properties
			let configFile = this.storeService.storage.store;
			configFile['api-key'] = 'redacted';
			configFile.auth = 'redacted'; // Authentication details from older versions
			configFile.oauth = 'redacted';
			configFile['osu-oauth'] = 'redacted';
			configFile.irc.username = 'redacted';
			configFile.irc.password = 'redacted';

			configFile = JSON.stringify(configFile, null, '\t');

			this.electronService.fs.writeFile(file.filePath, configFile, err => {
				if (err) {
					this.toastService.addToast(`Something went wrong while trying to export the config file: ${err.message}.`, ToastType.Error);
				}
				else {
					this.toastService.addToast(`Successfully saved the config file to "${file.filePath}".`);
				}
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

	toggleSplitIrcMessages(): void {
		this.splitIrcMessages = !this.splitIrcMessages;
		this.genericService.setSplitBanchoMessages(this.splitIrcMessages);
	}
}
