import { Component, Input, OnInit } from '@angular/core';
import { WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Component({
	selector: 'app-mappool',
	templateUrl: './mappool.component.html',
	styleUrls: ['./mappool.component.scss']
})
export class MappoolComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() mappool: WyMappool;

	constructor() { }
	ngOnInit(): void { }
}
