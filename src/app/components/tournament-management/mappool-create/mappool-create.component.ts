import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Component({
	selector: 'app-mappool-create',
	templateUrl: './mappool-create.component.html',
	styleUrls: ['./mappool-create.component.scss']
})
export class MappoolCreateComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	constructor() { }

	ngOnInit(): void {
		this.createNewMappool();
	}

	/**
	 * Create a new mappool
	 */
	createNewMappool(): void {
		const newMappool = new WyMappool({
			localId: this.tournament.mappools.length + 1,
			name: `Unnamed mappool`
		});

		this.tournament.mappools.push(newMappool);

		this.validationForm.addControl(`mappool-${newMappool.localId}-name`, new FormControl('', Validators.required));
		this.validationForm.addControl(`mappool-${newMappool.localId}-type`, new FormControl('', Validators.required));
	}
}
