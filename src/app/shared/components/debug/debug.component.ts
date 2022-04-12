import { Component, Input, OnInit } from '@angular/core';
import { DebugService } from 'app/services/debug.service';

@Component({
	selector: 'app-debug',
	templateUrl: './debug.component.html',
	styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {
	@Input() data: any;

	constructor(private debugService: DebugService) { }

	ngOnInit(): void { }

	/**
	 * Get the size of the object
	 *
	 * @param object the object
	 */
	objectSize(object: any): number {
		return (object != null || object != undefined) && typeof object == 'object' ? Object.keys(object).length : 0;
	}

	/**
	 * Toggle the state of the clicked item
	 *
	 * @param event the clicked item
	 * @param name the name of the clicked item
	 */
	toggleActive(event: MouseEvent, name: string) {
		event.stopPropagation();

		if (this.debugService.debugDataState.indexOf(`value-${name}`) > -1) {
			this.debugService.debugDataState.splice(this.debugService.debugDataState.indexOf(`value-${name}`), 1);
		}
		else {
			this.debugService.debugDataState.push(`value-${name}`);
		}
	}

	/**
	 * Check if the clicked item is active
	 *
	 * @param name the name of the clicked item
	 */
	isActive(name: string) {
		return this.debugService.debugDataState.indexOf(name) > -1;
	}
}
