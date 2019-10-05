import { Injectable } from '@angular/core';
import { Toast, ToastType } from '../models/toast';

@Injectable({
  	providedIn: 'root'
})

export class ToastService {
	private lastId: number = 0;
	private allToasts: Toast[];

	constructor() {
		this.allToasts = [];
	}
	  
	/**
	 * Create a new toast message for the given duration
	 * @param message the message to show
	 * @param duration how long the toast should stay alive (in seconds)
	 */
	addToast(message: string, toastType: ToastType = ToastType.Information, duration: number = 5): void {
		const newToast = new Toast(this.lastId + 1, message, toastType);

		this.allToasts.unshift(newToast);
		this.lastId ++;

		setTimeout(() => {
			this.removeToast(newToast);
		}, duration * 1000);
	}

	/**
	 * Remove a toast so that it is no longer visible
	 * @param toast the toast to remove
	 */
	removeToast(toast: Toast): void {
		this.allToasts.splice(this.allToasts.indexOf(toast), 1);
	}

	/**
	 * Get all the toasts
	 */
	getAllToasts() {
		return this.allToasts;
	}
}
