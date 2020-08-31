import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { Toast, ToastType } from '../../../models/toast';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
	selector: 'app-toast',
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.scss'],
	animations: [
		trigger('simpleFadeAnimation', [
			state('in', style({
				opacity: 1
			})),

			transition(':enter', [
				style({
					opacity: 0, transform: 'translateY(-40px)'
				}),
				animate(400)
			]),

			transition(':leave', animate(400, style({
				opacity: 0, transform: 'translateY(40px)'
			})))
		])
	]
})

export class ToastComponent implements OnInit {
	allToasts;

	toastType;

	constructor(private toastService: ToastService) {
		this.allToasts = toastService.getAllToasts();

		this.toastType = ToastType;
	}

	ngOnInit() { }

	removeToast(toast: Toast): void {
		this.toastService.removeToast(toast);
	}
}
