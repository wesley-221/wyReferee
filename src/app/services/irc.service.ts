import { Injectable } from '@angular/core';
import * as irc from 'irc-upd';
import { ToastService } from './toast.service';
import { ToastType } from '../models/toast';

@Injectable({
  	providedIn: 'root'
})

export class IrcService {
	irc: typeof irc;
	client: typeof irc.Client;

  	constructor(private toastService: ToastService) { 
		this.irc = require('irc-upd');
	}

	connect(username: string, password: string) {
		this.client = new irc.Client('irc.ppy.sh', username, {
			password: password, 
			autoConnect: false, 
			autoRejoin: false,
			retryCount: 0,
			debug: false
		});

		this.client.addListener('error', error => {
			this.toastService.addToast(error, ToastType.Error);
		});

		this.client.addListener('message', (from, to, message) => {
			console.log(`${from} => ${to}: ${message}`);
		});

		this.client.connect(0, err => {
			
		});
	}
}
