import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MappoolType } from 'app/models/wytournament/mappool/wy-mappool';
import { WyConditionalMessage } from 'app/models/wytournament/wy-conditional-message';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Component({
	selector: 'app-tournament-conditional-message',
	templateUrl: './tournament-conditional-message.component.html',
	styleUrls: ['./tournament-conditional-message.component.scss']
})
export class TournamentConditionalMessageComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	hasCTMMappool: boolean;

	constructor() {
		this.hasCTMMappool = false;
	}

	ngOnInit(): void {
		if (this.tournament.mappools && this.tournament.mappools.length > 0) {
			for (const mappool of this.tournament.mappools) {
				if (mappool.type == MappoolType.CTMTournament) {
					this.hasCTMMappool = true;
					return;
				}
			}
		}
	}

	createNewMessage(): void {
		this.validationForm.addControl(`conditional-message-${this.tournament.conditionalMessageIndex}`, new FormControl('', Validators.required));

		this.tournament.conditionalMessages.push(new WyConditionalMessage({
			index: this.tournament.conditionalMessageIndex++
		}));
	}

	removeConditionalMessage(message: WyConditionalMessage) {
		this.validationForm.removeControl(`conditional-message-${message.index}`);

		this.tournament.conditionalMessages.splice(this.tournament.conditionalMessages.indexOf(message), 1);
	}
}
