import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Component({
	selector: 'app-tournament-team-participants',
	templateUrl: './tournament-team-participants.component.html',
	styleUrls: ['./tournament-team-participants.component.scss']
})
export class TournamentTeamParticipantsComponent {
	@Input() form: FormGroup;
	@Input() tournament: WyTournament;
	@Input() importingFromWyBin: boolean;
	@Input() usersToAdd: string;
	@Output() usersToAddChange = new EventEmitter<string>();
	@Input() teamFilter: string;
	@Output() teamFilterChange = new EventEmitter<string>();

	@Output() addTeam = new EventEmitter<void>();
	@Output() addBulkTeams = new EventEmitter<void>();
	@Output() importWyBinTeams = new EventEmitter<void>();
	@Output() deleteTeam = new EventEmitter<number>();
	@Output() addNewPlayer = new EventEmitter<AbstractControl>();
	@Output() addBulkPlayers = new EventEmitter<AbstractControl>();
	@Output() removePlayerFromTeam = new EventEmitter<{ team: AbstractControl; playerIndex: number }>();

	collapsedState: Map<AbstractControl, boolean> = new Map();

	get teams(): FormArray {
		return this.form.get('teams') as FormArray;
	}

	trackByIndex(index: number): number {
		return index;
	}

	collapse(team: AbstractControl, event: MouseEvent): void {
		if ((event.target as HTMLElement).closest('button')) {
			return;
		}

		const currentState = this.collapsedState.get(team) ?? true;
		this.collapsedState.set(team, !currentState);
	}

	getPlayersFormArray(index: number): FormArray {
		return this.teams.at(index).get('players') as FormArray;
	}
}
