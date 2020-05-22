import { Component, OnInit, Input } from '@angular/core';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';

@Component({
	selector: 'app-mappool',
	templateUrl: './mappool.component.html',
	styleUrls: ['./mappool.component.scss']
})
export class MappoolComponent implements OnInit {
	@Input() mappool: Mappool;

	constructor() {

	}

	ngOnInit(): void { }

	/**
	 * Change the gamemode of the mappool
	 */
	changeGamemode(event) {
		this.mappool.gamemodeId = event.target.value;
	}

	/**
	 * Create a new bracket
	 */
	createNewBracket() {
		this.mappool.addBracket(new ModBracket());
	}
}
