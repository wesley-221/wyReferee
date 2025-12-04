import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastType } from 'app/models/toast';
import { AuthenticateService } from 'app/services/authenticate.service';
import { ElectronService } from 'app/services/electron.service';
import { IrcService } from 'app/services/irc.service';
import { ApiKeyValidation } from 'app/services/osu-api/api-key-validation.service';
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

	ircLoginTimeout: NodeJS.Timeout;
	showIrcLoginTimeout: boolean;

	constructor(
		private apiKeyValidation: ApiKeyValidation,
		private toastService: ToastService,
		public authService: AuthenticateService,
		public ircService: IrcService,
		public electronService: ElectronService,
		private ref: ChangeDetectorRef
	) {
		this.apiKeyIsValid = false;
		this.isAuthenticating = false;
		this.isConnecting = false;
		this.isDisconnecting = false;
		this.showIrcLoginTimeout = false;

		this.ircLoginForm = new FormGroup({
			'irc-username': new FormControl('', [
				Validators.required
			]),
			'irc-password': new FormControl('', [
				Validators.required
			])
		});

		window.electronApi.osuAuthentication.getIrcCredentials().then(credentials => {
			this.apiKey = credentials.apiKey;

			if (this.apiKey && this.apiKey.length > 0) {
				this.apiKeyIsValid = true;
			}
		});

		this.isAuthenticating = false;
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

		// Subscribe to the isAuthenticated variable to clear the irc login timeout message
		this.ircService.getIsAuthenticated().subscribe(value => {
			if (value == true) {
				clearTimeout(this.ircLoginTimeout);
				this.showIrcLoginTimeout = false;
			}
		});
	}

	/**
	 * Start osu authentication process
	 */
	authenticateOsu(): void {
		this.isAuthenticating = true;

		this.authService.startOsuOauthProcess().subscribe(token => {
			if (token != null) {
				this.authService.handleOauth(token).subscribe(authenticationResponse => {
					window.electronApi.authentication.setSession(authenticationResponse.sessionId);

					this.authService.loginUser(authenticationResponse.user);

					this.ref.detectChanges();
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
		if (this.ircLoginForm.invalid) {
			this.ircLoginForm.markAllAsTouched();
			return;
		}

		const username = this.ircLoginForm.get('irc-username').value.replace(/ /g, '_');
		const password = this.ircLoginForm.get('irc-password').value;

		this.ircService.connect(username, password, this.apiKey);

		this.ircLoginTimeout = setTimeout(() => {
			this.showIrcLoginTimeout = true;
		}, 7000);
	}

	disconnectIrc() {
		this.ircService.disconnect();
	}

	/**
	 * Save the api key with the entered value
	 */
	saveApiKey() {
		this.apiKey = this.apiKey.trim();

		this.apiKeyValidation.validate(this.apiKey).subscribe({
			next: () => {
				window.electronApi.osuAuthentication.setApiKey(this.apiKey);

				this.toastService.addToast('You have entered a valid api-key.', ToastType.Information);

				this.apiKeyIsValid = true;
			},
			error: () => {
				this.toastService.addToast('The entered api-key was invalid.', ToastType.Error);
			}
		});
	}
}
