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
	@Input() teamFilter: string;
	@Output() usersToAddChange = new EventEmitter<string>();
	@Output() teamFilterChange = new EventEmitter<string>();

	@Output() addTeam = new EventEmitter<void>();
	@Output() addBulkTeams = new EventEmitter<string>();
	@Output() importWyBinTeams = new EventEmitter<void>();
	@Output() deleteTeam = new EventEmitter<number>();
	@Output() addNewPlayer = new EventEmitter<AbstractControl>();
	@Output() addBulkPlayers = new EventEmitter<AbstractControl>();
	@Output() removePlayerFromTeam = new EventEmitter<{ team: AbstractControl; playerIndex: number }>();

	selectedTeam: AbstractControl;
	bulkPlayersTeam: AbstractControl;
	bulkTeamsOpen: boolean;;
	bulkTeamsText: string;

	constructor() {
		this.selectedTeam = null;
		this.bulkPlayersTeam = null;
		this.bulkTeamsOpen = false;
		this.bulkTeamsText = '';
	}

	get teams(): FormArray {
		return this.form.get('teams') as FormArray;
	}

	get activeTeam(): FormGroup | null {
		if (this.bulkTeamsOpen) {
			return null;
		}

		if (this.selectedTeam && this.teams.controls.includes(this.selectedTeam)) {
			return this.selectedTeam as FormGroup;
		}

		return (this.teams.at(0) as FormGroup) ?? null;
	}

	get selectedTeamIndex(): number {
		return this.activeTeam ? this.teams.controls.indexOf(this.activeTeam) : -1;
	}

	get hasMatchingTeams(): boolean {
		return this.filteredTeams.length > 0;
	}

	get filteredTeams(): AbstractControl[] {
		return this.teams.controls.filter(team => this.matchesTeam(team));
	}

	trackByIndex(index: number): number {
		return index;
	}

	trackByControl(_index: number, team: AbstractControl): AbstractControl {
		return team;
	}

	onTeamFilterInput(event: Event): void {
		this.teamFilter = (event.target as HTMLInputElement).value;
		this.teamFilterChange.emit(this.teamFilter);
	}

	createTeam(): void {
		this.addTeam.emit();
		this.selectedTeam = this.teams.at(this.teams.length - 1) ?? null;
		this.bulkTeamsOpen = false;
	}

	selectTeam(team: AbstractControl): void {
		this.selectedTeam = team;
		this.bulkTeamsOpen = false;
		this.bulkPlayersTeam = null;
	}

	matchesTeam(team: AbstractControl): boolean {
		const filter = (this.teamFilter || '').trim().toLowerCase();

		if (!filter) {
			return true;
		}

		const name = (team.get('name')?.value || '').toLowerCase();
		const playerNames = (team.get('players') as FormArray).controls
			.map(player => (player.get('name')?.value || '').toLowerCase());

		return name.includes(filter) || playerNames.some(playerName => playerName.includes(filter));
	}

	toggleBulkTeams(): void {
		if (this.bulkTeamsOpen) {
			this.closeBulkTeams();
			return;
		}

		this.selectedTeam = null;
		this.bulkTeamsOpen = true;
		this.bulkPlayersTeam = null;
	}

	closeBulkTeams(): void {
		this.bulkTeamsOpen = false;
		this.bulkTeamsText = '';
	}

	submitBulkTeams(): void {
		if (!this.bulkTeamsText.trim()) {
			return;
		}

		const teamCount = this.teams.length;

		this.addBulkTeams.emit(this.bulkTeamsText);

		if (this.teams.length > teamCount) {
			this.closeBulkTeams();
		}
	}

	toggleBulkPlayers(team: AbstractControl): void {
		if (this.bulkPlayersTeam === team) {
			this.closeBulkPlayers();
			return;
		}

		this.usersToAddChange.emit('');
		this.bulkPlayersTeam = team;
	}

	closeBulkPlayers(): void {
		this.bulkPlayersTeam = null;
		this.usersToAddChange.emit('');
	}

	submitBulkPlayers(team: AbstractControl): void {
		if (!this.usersToAdd?.trim()) {
			return;
		}

		const playerCount = (team.get('players') as FormArray).length;

		this.addBulkPlayers.emit(team);

		if ((team.get('players') as FormArray).length > playerCount) {
			this.closeBulkPlayers();
		}
	}

	getPlayersFormArray(index: number): FormArray {
		return (this.teams.at(index)?.get('players') as FormArray) ?? new FormArray([]);
	}
}
