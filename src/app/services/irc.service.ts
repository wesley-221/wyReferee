import { Injectable } from '@angular/core';
import * as irc from 'irc-upd';
import { ToastService } from './toast.service';
import { ToastType } from '../models/toast';
import { StoreService } from './store.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  	providedIn: 'root'
})

export class IrcService {
	irc: typeof irc;
	client: typeof irc.Client;

	isAuthenticated: boolean = false;
	authenticatedUser: string = "none";

	// Variable to tell if we are connecting to irc
	isConnecting$: BehaviorSubject<boolean>;
	isDisconnecting$: BehaviorSubject<boolean>;

  	constructor(private toastService: ToastService, private storeService: StoreService) { 
		this.irc = require('irc-upd');

		this.isConnecting$ = new BehaviorSubject<boolean>(false);
		this.isDisconnecting$ = new BehaviorSubject<boolean>(false);

		// Connect to irc if the credentials are saved
		const ircCredentials = storeService.get('irc');

		if(ircCredentials != undefined) {
			toastService.addToast('Irc credentials were found, attempting to login to irc.');
			this.connect(ircCredentials.username, ircCredentials.password);
		}
	}

	/**
	 * Check if we are connecting
	 */
	getIsConnecting(): Observable<boolean> {
		return this.isConnecting$.asObservable();
	}

	/**
	 * Check if we are disconnecting
	 */
	getIsDisconnecting(): Observable<boolean> {
		return this.isDisconnecting$.asObservable();
	}

	/**
	 * Connect the user to irc
	 * @param username the username to connect with
	 * @param password the password to connect with
	 */
	connect(username: string, password: string) {
		this.client = new irc.Client('irc.ppy.sh', username, {
			password: password, 
			autoConnect: false, 
			autoRejoin: false,
			retryCount: 0,
			debug: false
		});

		this.isConnecting$.next(true);

		this.client.addListener('error', error => {
			// Invalid password given
			if(error.command == "err_passwdmismatch") {
				this.isConnecting$.next(false);
				this.toastService.addToast('Invalid password given. Please try again', ToastType.Error);
			}
			else {
				console.log(error);

				this.toastService.addToast('Unknown error given! Check the console for more information.', ToastType.Error);
			}
		});

		this.client.addListener('message', (from, to, message) => {
			console.log(`${from} => ${to}: ${message}`);
		});

		this.client.connect(0, err => {
			this.isAuthenticated = true;
			this.authenticatedUser = username;

			// Save the credentials
			this.storeService.set('irc', {
				'username': username,
				'password': password
			});

			this.isConnecting$.next(false);

			this.toastService.addToast('Successfully connected to irc!');
		});
	}

	/**
	 * Disconnect the user from irc
	 */
	disconnect() {
		if(this.isAuthenticated) {
			this.client.removeAllListeners();

			this.isDisconnecting$.next(true);

			this.client.disconnect('', () => {
				this.isAuthenticated = false;
				this.authenticatedUser = "none";

				// Delete the credentials
				this.storeService.delete('irc');

				this.isDisconnecting$.next(false);

				this.toastService.addToast('Successfully disconnected from irc.');
			});
		}
	}
}
