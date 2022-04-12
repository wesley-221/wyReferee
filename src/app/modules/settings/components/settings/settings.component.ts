import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../../services/electron.service';
import { StoreService } from '../../../../services/store.service';
import { ToastService } from '../../../../services/toast.service';
import { ToastType } from '../../../../models/toast';
import { ApiKeyValidation } from '../../../../services/osu-api/api-key-validation.service';
import { MatDialog } from '@angular/material/dialog';
import { RemoveSettingsComponent } from '../../../../components/dialogs/remove-settings/remove-settings.component';
import { AuthenticateService } from 'app/services/authenticate.service';
import { IrcService } from 'app/services/irc.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OauthService } from 'app/services/oauth.service';
import { GenericService } from 'app/services/generic.service';
import { User } from 'app/models/authentication/user';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
	apiKey: string;
	isAuthenticating: boolean;

	dialogMessage: string;
	dialogAction = 0;

	mappoolPublishForm: FormGroup;
	ircLoginForm: FormGroup;

	isConnecting = false;
	isDisconnecting = false;

	apiKeyIsValid = false;

	axsMenuStatus: boolean;

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
		private apiKeyValidation: ApiKeyValidation,
		private dialog: MatDialog,
		public auth: AuthenticateService,
		public ircService: IrcService,
		private oauthService: OauthService,
		private genericService: GenericService,
		private authenticateService: AuthenticateService
	) {
		this.apiKey = this.storeService.get('api-key');
		this.isAuthenticating = false;

		if (this.apiKey && this.apiKey.length > 0) {
			this.apiKeyIsValid = true;
		}

		this.genericService.getAxSMenuStatus().subscribe(status => {
			this.axsMenuStatus = status;
		});
	}

	ngOnInit() {
		this.mappoolPublishForm = new FormGroup({
			username: new FormControl('', [
				Validators.required
			]),
			password: new FormControl('', [
				Validators.required
			])
		});

		this.ircLoginForm = new FormGroup({
			'irc-username': new FormControl('', [
				Validators.required
			]),
			'irc-password': new FormControl('', [
				Validators.required
			])
		});

		// Subscribe to the isConnecting variable to show/hide the spinner
		this.ircService.getIsConnecting().subscribe(value => {
			this.isConnecting = value;
		});

		// Subscribe to the isConnecting variable to show/hide the spinner
		this.ircService.getIsDisconnecting().subscribe(value => {
			this.isDisconnecting = value;
		});
	}

	/**
	 * Start osu authentication process
	 */
	authenticateOsu(): void {
		this.isAuthenticating = true;

		this.authenticateService.startOsuOauthProcess().subscribe(token => {
			if (token != null) {
				this.oauthService.cacheOsuOauth(token);

				this.auth.getMeData(true).subscribe(data => {
					this.auth.loggedInUser = User.makeTrueCopy(data.user);
					this.auth.loggedIn = true;

					this.oauthService.cacheOauth(data.oauthToken);

					this.toastService.addToast(`Successfully logged in, welcome ${this.auth.loggedInUser.username}!`);
				});
			}

			this.isAuthenticating = false;
		});
	}

	logoutOsu(): void {
		this.storeService.delete('oauth');
		this.storeService.delete('osu-oauth');
		this.auth.loggedIn = false;
		this.auth.loggedInUser = null;

		this.toastService.addToast('You have been logged out.');
	}

	/**
	 * Login to irc with the given credentials
	 */
	connectIrc() {
		const username = this.ircLoginForm.get('irc-username').value;
		const password = this.ircLoginForm.get('irc-password').value;

		this.ircService.connect(username, password);
	}

	disconnectIrc() {
		this.ircService.disconnect();
	}

	/**
	 * Get the api key
	 */
	getApiKey() {
		return this.storeService.get('api-key');
	}

	/**
	 * Save the api key with the entered value
	 */
	saveApiKey() {
		// Key is valid
		this.apiKeyValidation.validate(this.apiKey).subscribe(() => {
			this.storeService.set('api-key', this.apiKey);
			this.toastService.addToast('You have entered a valid api-key.', ToastType.Information);

			this.apiKeyIsValid = true;
		},
			// Key is invalid
			() => {
				this.toastService.addToast('The entered api-key was invalid.', ToastType.Error);
			});
	}

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

		this.apiKeyIsValid = false;
		this.apiKey = null;
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
}
