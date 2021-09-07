import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

export interface ITournamentInvite {
	administrator: boolean;
	access: boolean;
}

@Component({
	selector: 'app-tournament',
	templateUrl: './tournament.component.html',
	styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	constructor() { }
	ngOnInit(): void { }
}
