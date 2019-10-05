import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { Toast } from '../../../models/toast';

@Component({
	selector: 'app-toast',
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.scss']
})

export class ToastComponent implements OnInit {
	allToasts;

	constructor(private toastService: ToastService) { 
		this.allToasts = toastService.getAllToasts();
	}

	ngOnInit() { }

	removeToast(toast: Toast): void {
		this.toastService.removeToast(toast);
	}
}
