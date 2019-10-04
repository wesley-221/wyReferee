import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { StoreService } from '../../services/store.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
	@ViewChild('apiKey', { static: false }) apiKey: ElementRef;

	constructor(private electronService: ElectronService, private storeService: StoreService) { }
	ngOnInit() { }

	/**
	 * Get the api key
	 */
	getApiKey() {
		return this.storeService.get('api-key');
	}

	/**
	 * Save the api key with the entered value
	 * TODO: Validation :)
	 */
	saveApiKey() {
		this.storeService.set('api-key', this.apiKey.nativeElement.value);
	}
}
