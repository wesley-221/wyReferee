import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Component({
	selector: 'app-tournament-create',
	templateUrl: './tournament-create.component.html',
	styleUrls: ['./tournament-create.component.scss']
})
export class TournamentCreateComponent implements OnInit {
	tournament: WyTournament;
	validationForm: FormGroup;

	constructor() {
		this.tournament = new WyTournament();

		this.validationForm = new FormGroup({
			'tournament-name': new FormControl('', [
				Validators.required
			]),
			'tournament-acronym': new FormControl('', [
				Validators.required
			]),
			'tournament-gamemode': new FormControl('', [
				Validators.required
			]),
			'tournament-score-system': new FormControl('', [
				Validators.required
			]),
			'tournament-team-size': new FormControl('', [
				Validators.required,
				Validators.min(1),
				Validators.max(8)
			]),
			'tournament-format': new FormControl('', [
				Validators.required
			]),
			'webhook': new FormControl('', [
				Validators.required
			]),
			'test-webhook': new FormControl('', [
				Validators.required
			])
		});
	}

	ngOnInit(): void { }
}
