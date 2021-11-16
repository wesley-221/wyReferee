import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DebugService {
	menuActive: boolean;
	debugData: any;
	debugDataState: any[];

	constructor() {
		this.menuActive = false;
		this.debugDataState = [];
	}

	/**
	 * Reset the debug data
	 */
	resetDebugData(): void {
		this.debugData = [];
		this.debugDataState = [];
	}

	/**
	 * Set new debug data
	 * @param data the new data
	 */
	setDebugData(data: any): void {
		this.resetDebugData();

		const finalData = {};

		for (const i in data) {
			const ignorePartialStrings = ['service', 'router', 'dialog'];
			const ignoreStrings = ['multiplayerLobbies', '__ngContext__'];

			if (ignorePartialStrings.some(element => i.toLowerCase().includes(element))) continue;
			if (ignoreStrings.indexOf(i) > -1) continue;

			// console.log(i);
			// console.log(data[i]);
			// continue;

			finalData[i] = data[i];
		}

		this.debugData = data;
	}
}
