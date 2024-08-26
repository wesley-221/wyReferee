import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MappoolType } from 'app/models/wytournament/mappool/wy-mappool';
import { WyBeatmapResultMessage } from 'app/models/wytournament/wy-beatmap-result-message';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Component({
	selector: 'app-tournament-beatmap-result',
	templateUrl: './tournament-beatmap-result.component.html',
	styleUrls: ['./tournament-beatmap-result.component.scss']
})
export class TournamentBeatmapResultComponent implements OnInit {
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
		this.validationForm.addControl(`beatmap-result-message-${this.tournament.beatmapResultMessageIndex}`, new FormControl('', Validators.required));

		this.tournament.beatmapResultMessages.push(new WyBeatmapResultMessage({
			index: this.tournament.beatmapResultMessageIndex++
		}));
	}

	removeBeatmapResultMessage(message: WyBeatmapResultMessage) {
		this.validationForm.removeControl(`beatmap-result-message-${message.index}`);

		this.tournament.beatmapResultMessages.splice(this.tournament.beatmapResultMessages.indexOf(message), 1);
	}

	nextPickChange(message: WyBeatmapResultMessage, event: MatSlideToggleChange) {
		message.nextPickMessage = event.checked;
	}

	nextpickTiebreakerChange(message: WyBeatmapResultMessage, event: MatSlideToggleChange) {
		message.nextPickTiebreakerMessage = event.checked;
	}

	matchWonChange(message: WyBeatmapResultMessage, event: MatSlideToggleChange) {
		message.matchWonMessage = event.checked;
	}
}
