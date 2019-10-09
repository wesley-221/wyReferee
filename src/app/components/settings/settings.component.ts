import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { StoreService } from '../../services/store.service';
import { ToastService } from '../../services/toast.service';
import { ToastType } from '../../models/toast';
import { ApiKeyValidation } from '../../services/osu-api/api-key-validation.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
	@ViewChild('apiKey', { static: false }) apiKey: ElementRef;

	constructor(
		private electronService: ElectronService, 
		private storeService: StoreService, 
		private toastService: ToastService,
		private apiKeyValidation: ApiKeyValidation
	) { }
	ngOnInit() { }

	/**
	 * Get the api key
	 */
	getApiKey() {
		return this.storeService.get('api-key');
	}

	/**
	 * Save the api key with the entered value
	 */
	saveApiKey() {
		const apiKey = this.storeService.get('api-key');

		// Check if the key hasn't changed
		if(apiKey == this.apiKey.nativeElement.value) {
			this.toastService.addToast('The entered api-key is the same as the one already saved.', ToastType.Information);
		}
		else {
			this.storeService.set('api-key', this.apiKey.nativeElement.value);

			// Key is valid
			this.apiKeyValidation.validate(this.apiKey.nativeElement.value).subscribe(() => {
				this.toastService.addToast('You have entered a valid api-key.', ToastType.Information);
			}, 
			// Key is invalid
			err => {
				this.toastService.addToast('The entered api-key was invalid.', ToastType.Error);
			});
		}
	}
}
