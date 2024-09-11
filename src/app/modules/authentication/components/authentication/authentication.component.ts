import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastType } from 'app/models/toast';
import { AuthenticateService } from 'app/services/authenticate.service';
import { ElectronService } from 'app/services/electron.service';
import { IrcService } from 'app/services/irc.service';
import { ApiKeyValidation } from 'app/services/osu-api/api-key-validation.service';
import { StoreService } from 'app/services/store.service';
import { ToastService } from 'app/services/toast.service';

@Component({
	selector: 'app-authentication',
	templateUrl: './authentication.component.html',
	styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
	apiKey: string;
	apiKeyIsValid: boolean;

	isAuthenticating: boolean;
	isConnecting: boolean;
	isDisconnecting: boolean;

	ircLoginForm: FormGroup;

	constructor(private apiKeyValidation: ApiKeyValidation, private storeService: StoreService, private toastService: ToastService, public authService: AuthenticateService, public ircService: IrcService, public electronService: ElectronService) {
		this.apiKeyIsValid = false;
		this.isAuthenticating = false;
		this.isConnecting = false;
		this.isDisconnecting = false;

		this.ircLoginForm = new FormGroup({
			'irc-username': new FormControl('', [
				Validators.required
			]),
			'irc-password': new FormControl('', [
				Validators.required
			])
		});

		this.apiKey = this.storeService.get('api-key');
		this.isAuthenticating = false;

		if (this.apiKey && this.apiKey.length > 0) {
			this.apiKeyIsValid = true;
		}
	}

	ngOnInit(): void {
		// Subscribe to the isConnecting variable to show/hide the spinner
		this.ircService.getIsConnecting().subscribe(value => {
			this.isConnecting = value;
		});

		// Subscribe to the isDisConnecting variable to show/hide the spinner
		this.ircService.getIsDisconnecting().subscribe(value => {
			this.isDisconnecting = value;
		});
	}

	/**
	 * Start osu authentication process
	 */
	authenticateOsu(): void {
		this.isAuthenticating = true;

		this.authService.startOsuOauthProcess().subscribe(token => {
			if (token != null) {
				this.authService.handleOauth(token).subscribe(user => {
					this.authService.loginUser(user);
				});
			}

			this.isAuthenticating = false;
		});
	}

	/**
	 * Logout the user
	 */
	logoutOsu(): void {
		this.authService.logout();
	}

	/**
	 * Login to irc with the given credentials
	 */
	connectIrc() {
		const username = this.ircLoginForm.get('irc-username').value.replace(/ /g, '_');
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
}
