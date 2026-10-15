import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Component({
	selector: 'app-tournament-solo-participants',
	templateUrl: './tournament-solo-participants.component.html',
	styleUrls: ['./tournament-solo-participants.component.scss']
})
export class TournamentSoloParticipantsComponent {
	@Input() form: FormGroup;
	@Input() tournament: WyTournament;
	@Input() importingFromWyBin: boolean;
	@Input() teamsToAdd: string;
	@Output() teamsToAddChange = new EventEmitter<string>();

	@Output() addTeam = new EventEmitter<void>();
	@Output() addBulkPlayers = new EventEmitter<void>();
	@Output() importWyBinPlayers = new EventEmitter<void>();
	@Output() deletePlayer = new EventEmitter<number>();

	collapsedState: Map<AbstractControl, boolean> = new Map();

	get players(): FormArray {
		return this.form.get('players') as FormArray;
	}

	trackByIndex(index: number): number {
		return index;
	}

	collapse(player: AbstractControl, event: MouseEvent): void {
		if ((event.target as HTMLElement).closest('button')) {
			return;
		}

		const currentState = this.collapsedState.get(player) ?? true;
		this.collapsedState.set(player, !currentState);
	}
}
