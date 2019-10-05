import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { Toast, ToastType } from '../../../models/toast';

@Component({
	selector: 'app-toast',
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.scss']
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
