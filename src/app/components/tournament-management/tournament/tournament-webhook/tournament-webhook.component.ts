import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Component({
	selector: 'app-tournament-webhook',
	templateUrl: './tournament-webhook.component.html',
	styleUrls: ['./tournament-webhook.component.scss']
})
export class TournamentWebhookComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	constructor() { }
	ngOnInit(): void { }
}
