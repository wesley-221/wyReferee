import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticateService } from '../../../services/authenticate.service';
import { ToastService } from '../../../services/toast.service';
import { ToastType } from '../../../models/toast';
import { IrcService } from '../../../services/irc.service';
import { ElectronService } from '../../../services/electron.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	mappoolPublishForm: FormGroup;
	ircForm: FormGroup;

	isConnecting: boolean = false;
	isDisconnecting: boolean = false;
	
	constructor(private auth: AuthenticateService, private toastService: ToastService, public ircService: IrcService, public electronService: ElectronService) { }

	ngOnInit() {
		this.mappoolPublishForm = new FormGroup({
			'username': new FormControl('', [
				Validators.required
			]),
			'password': new FormControl('', [
				Validators.required
			])
		});

		this.ircForm = new FormGroup({
			'username': new FormControl('', [
				Validators.required
			]),
			'password': new FormControl('', [
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
	 * Login the user with the given username and password
	 */
	loginMappoolPublish() {
		const 	username = this.mappoolPublishForm.get('username').value, 
				password = this.mappoolPublishForm.get('password').value;

		this.auth.login(username, password).then(res => {
			this.toastService.addToast(`Successfully logged in with the username "${this.auth.loggedInUser}"!`);
		}).catch((err: Error) => {
			this.toastService.addToast(`Something went wrong while trying to login: "${err.message}"`, ToastType.Error);
		});
	}

	/**
	 * Login to irc with the given credentials
	 */
	connectIrc() {
		const 	username = this.ircForm.get('username').value, 
				password = this.ircForm.get('password').value;

		this.ircService.connect(username, password);
	}

	disconnectIrc() {
		this.ircService.disconnect();
	}
}
