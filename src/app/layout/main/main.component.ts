import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DebugService } from 'app/services/debug.service';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
	constructor(public router: Router, public debugService: DebugService) { }

	/**
	 * Trigger the debug menu
	 *
	 * @param event the triggered button
	 */
	@HostListener('window:keydown', ['$event'])
	triggerDebugMenu(event: KeyboardEvent) {
		if (event.key == 'F1') {
			this.debugService.menuActive = !this.debugService.menuActive;
		}
	}

	ngOnInit() { }
}
