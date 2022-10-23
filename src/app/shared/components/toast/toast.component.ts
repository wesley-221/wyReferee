import { Component, OnInit, Renderer2 } from '@angular/core';
import { trigger } from '@angular/animations';
import { Toast, ToastType } from 'app/models/toast';
import { ToastService } from 'app/services/toast.service';

@Component({
	selector: 'app-toast',
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.scss'],
	animations: [
		trigger('simpleFadeAnimation', [])
	]
})

export class ToastComponent implements OnInit {
	allToasts: Toast[];
	toastType: any;

	constructor(private toastService: ToastService, private render: Renderer2) {
		this.allToasts = toastService.getAllToasts();
		this.toastType = ToastType;
	}

	ngOnInit() { }

	removeToast(toast: Toast): void {
		this.toastService.removeToast(toast);
	}

	/**
	 * Gets called when a toast enters the screen
	 *
	 * @param event
	 */
	onAnimationEvent(event: any) {
		// Add 1 ms delay to add class so that the border doesnt hide right away
		setTimeout(() => {
			this.render.addClass(event.element, 'in');
		}, 1);
	}
}
