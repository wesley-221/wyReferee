import { Component, OnInit } from '@angular/core';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';

@Component({
	selector: 'app-mappool-create',
	templateUrl: './mappool-create.component.html',
	styleUrls: ['./mappool-create.component.scss']
})

export class MappoolCreateComponent implements OnInit {
	allBrackets: ModBracket[] = [];

	constructor() { }
	ngOnInit() { }

	createNewBracket() {
		this.allBrackets.push(new ModBracket());
	}
}
