import { Injectable } from '@angular/core';
import * as irc from 'irc';
import { ToastService } from './toast.service';
import { ToastType } from '../models/toast';

@Injectable({
  	providedIn: 'root'
})

export class IrcService {
	irc: typeof irc;
	client: typeof irc.Client;

  	constructor(private toastService: ToastService) { 
		this.irc = require('irc');
	}

	connect(username: string, password: string) {
		this.client = this.irc.Client('irc.ppy.sh', username, {
			password: password, 
			autoConnect: false, 
			debug: true,
			channels: ['#osu']
		});

		// this.client.addListener('error', error => {
		// 	this.toastService.addToast(error, ToastType.Error);
		// });

		// this.client.addListener('message', (from, to, message) => {
		// 	console.log(`${from} => ${to}: ${message}`);
		// });
	}
}
