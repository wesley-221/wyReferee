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

	playerFilter: string;
	bulkAddOpen: boolean;;

	constructor() {
		this.playerFilter = '';
		this.bulkAddOpen = false;
	}

	get players(): FormArray {
		return this.form.get('players') as FormArray;
	}

	get filteredPlayers(): AbstractControl[] {
		const filter = this.playerFilter.trim().toLocaleLowerCase();

		if (!filter) {
			return this.players.controls;
		}

		return this.players.controls.filter(player => {
			const name = (player.get('name')?.value || '').toLocaleLowerCase();
			const userId = (player.get('userId')?.value || '').toString().toLocaleLowerCase();
			return name.includes(filter) || userId.includes(filter);
		});
	}

	get teamsToAddCount() {
		return this.teamsToAdd?.trim().split('\n').length || 0;
	}

	trackByControl(_index: number, player: AbstractControl): AbstractControl {
		return player;
	}

	onPlayerFilterInput(event: Event): void {
		this.playerFilter = (event.target as HTMLInputElement).value;
	}

	toggleBulkAdd(): void {
		if (this.bulkAddOpen) {
			this.closeBulkAdd();
			return;
		}

		this.teamsToAddChange.emit('');
		this.bulkAddOpen = true;
	}

	closeBulkAdd(): void {
		this.bulkAddOpen = false;
		this.teamsToAddChange.emit('');
	}

	submitBulkAdd(): void {
		if (!this.teamsToAdd?.trim()) {
			return;
		}

		const currentCount = this.players.length;

		this.addBulkPlayers.emit();

		if (this.players.length > currentCount) {
			this.closeBulkAdd();
		}
	}
}
