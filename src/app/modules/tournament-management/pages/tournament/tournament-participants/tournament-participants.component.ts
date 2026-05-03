import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddBulkTeamsDialogComponent } from 'app/components/dialogs/add-bulk-teams-dialog/add-bulk-teams-dialog.component';
import { DeleteTeamDialogComponent } from 'app/components/dialogs/delete-team-dialog/delete-team-dialog.component';
import { WyTeam } from 'app/models/wytournament/wy-team';
import { WyTeamPlayer } from 'app/models/wytournament/wy-team-player';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { TournamentEditStateService } from '../../../services/tournament-edit-state.service';
import { debounceTime, filter } from 'rxjs';

@Component({
	selector: 'app-tournament-participants',
	templateUrl: './tournament-participants.component.html',
	styleUrls: ['./tournament-participants.component.scss']
})
export class TournamentParticipantsComponent implements OnInit {
	tournament: WyTournament;
	form: FormGroup;

	collapsedState: WeakMap<AbstractControl, boolean>;

	usersToAdd: string;
	teamsToAdd: string;

	teamFilter: string;

	importingFromWyBin: boolean;

	constructor(
		private dialog: MatDialog,
		private toastService: ToastService,
		private tournamentService: TournamentService,
		private tournamentEditStateService: TournamentEditStateService
	) {
		this.importingFromWyBin = false;

		this.form = new FormGroup({
			players: new FormArray([]),
			teams: new FormArray([])
		});

		this.collapsedState = new WeakMap();
	}

	ngOnInit(): void {
		this.tournamentEditStateService.getDraft$()
			.pipe(filter(v => !!v))
			.subscribe(tournament => {
				this.tournament = tournament;

				if (tournament.isSoloTournament()) {
					if (this.players.length === 0) {
						const formArray = new FormArray(
							tournament.teams.map(t => this.createPlayerGroup(t.id, t.name, t.userId))
						);

						this.form.setControl('players', formArray, { emitEvent: false });
					}
					else {
						tournament.teams.forEach((t, i) => {
							this.players.at(i)?.patchValue({
								id: t.id,
								name: t.name,
								userId: t.userId
							}, { emitEvent: false });
						});
					}
				}
				else {
					if (this.teams.length === 0) {
						const formArray = new FormArray(
							tournament.teams.map(t => this.createTeamGroup(t))
						);

						this.form.setControl('teams', formArray, { emitEvent: false });
					}
					else {
						tournament.teams.forEach((t, i) => {
							const teamGroup = this.teams.at(i) as FormGroup;

							if (!teamGroup) {
								return;
							}

							teamGroup.patchValue({
								id: t.id,
								name: t.name
							}, { emitEvent: false });

							const playersArray = new FormArray(
								t.players.map(p => this.createPlayerGroup(p.id, p.name, p.userId))
							);

							teamGroup.setControl('players', playersArray, { emitEvent: false });
						});
					}
				}
			});

		this.form.valueChanges
			.pipe(debounceTime(200))
			.subscribe(value => {
				if (this.tournament.isSoloTournament()) {
					this.tournamentEditStateService.updatePlayersForm(value.players);
				}
				else {
					this.tournamentEditStateService.updateTeamsForm(value.teams);
				}
			});
	}

	get teams(): FormArray {
		return this.form.get('teams') as FormArray;
	}

	get players(): FormArray {
		return this.form.get('players') as FormArray;
	}

	trackByIndex(index: number) {
		return index;
	}

	collapse(team: AbstractControl, event: MouseEvent) {
		if ((event.target as HTMLElement).closest('button')) {
			return;
		}

		const currentState = this.collapsedState.get(team) ?? true;
		this.collapsedState.set(team, !currentState);
	}

	addTeam() {
		if (this.tournament.isSoloTournament()) {
			this.players.push(this.createPlayerGroup(null, '', null));
		}
		else {
			this.teams.push(this.createTeamGroup());
		}
	}

	addNewPlayer(team: AbstractControl) {
		(team.get('players') as FormArray).push(this.createPlayerGroup(null, '', null));
	}

	deletePlayer(i: number) {
		this.players.removeAt(i);
	}

	deleteTeam(index: number) {
		if (this.tournament.isSoloTournament()) {
			this.players.removeAt(index);
		}
		else {
			const team = this.teams.at(index);

			const dialogRef = this.dialog.open(DeleteTeamDialogComponent, {
				data: {
					team: new WyTeam({
						name: team.get('name').value
					})
				}
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result != null) {
					this.teams.removeAt(index);

					this.toastService.addToast(`Successfully removed the team ${team.get('name').value} from the tournament.`);
				}
			});
		}
	}

	removePlayerFromTeam(teamGroup: AbstractControl, playerIndex: number) {
		(teamGroup.get('players') as FormArray).removeAt(playerIndex);
	}

	addBulkPlayers(teamGroup: AbstractControl) {
		const allUsers = this.usersToAdd.split('\n');

		allUsers.forEach(user => {
			const teamPlayer = new WyTeamPlayer();
			const [username, userId] = user.trim().split(',');

			teamPlayer.name = username.trim();
			teamPlayer.userId = parseInt(userId.trim());

			(teamGroup.get('players') as FormArray).push(this.createPlayerGroup(null, teamPlayer.name, teamPlayer.userId));
		});

		this.usersToAdd = null;
	}

	addBulkTeams(): void {
		const dialogRef = this.dialog.open(AddBulkTeamsDialogComponent);

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				const allTeams = result.split('\n');

				allTeams.forEach((team: string) => {
					const [teamName, ...players] = team.trim().split(',');

					const newTeam = new WyTeam({
						name: teamName.trim(),
						index: this.tournament.teamIndex,
						collapsed: true
					});

					for (let i = 0; i < players.length; i += 2) {
						const playerName = players[i].trim();
						const playerId = parseInt(players[i + 1]?.trim() || '') || null;

						const newPlayer = new WyTeamPlayer({
							name: playerName,
							userId: playerId
						});

						newTeam.players.push(newPlayer);
					}

					this.teams.push(this.createTeamGroup(newTeam));
				});
			}
		});
	}

	addBulkPlayersSoloTournament(): void {
		const allTeams = this.teamsToAdd.split('\n');

		allTeams.forEach(team => {
			const newTeam = new WyTeam();
			const [username, userId] = team.trim().split(',');

			newTeam.name = username.trim();
			newTeam.userId = parseInt(userId.trim());

			this.players.push(this.createPlayerGroup(null, newTeam.name, newTeam.userId));
		});

		this.teamsToAdd = null;
	}

	importWyBinPlayers(): void {
		this.importingFromWyBin = true;

		this.tournamentService.getWyBinTournamentPlayers(this.tournament.wyBinTournamentId).subscribe((players: any) => {
			const existingUserIds = new Set(
				this.players.controls
					.map(ctrl => ctrl.get('userId')?.value)
					.filter(v => v != null)
			);

			for (const player of players) {
				if (existingUserIds.has(player.user.userOsu.id)) {
					continue;
				}

				this.players.push(this.createPlayerGroup(null, player.user.username, player.user.userOsu.id));
			}

			this.importingFromWyBin = false;
		});
	}

	importWyBinTeams(): void {
		this.importingFromWyBin = true;

		this.tournamentService.getWyBinTournamentTeams(this.tournament.wyBinTournamentId).subscribe((teams: any) => {
			const existingUserIds = new Set(
				this.teams.controls
					.map(ctrl => ctrl.get('name')?.value)
					.filter(v => v != null)
			);

			for (const team of teams) {
				if (existingUserIds.has(team.name)) {
					continue;
				}

				const newTeam = new WyTeam({
					name: team.name,
					index: this.tournament.teamIndex,
					collapsed: true
				});

				this.tournament.teamIndex++;

				for (const teamMember of team.teamMembers) {
					const newPlayer = new WyTeamPlayer({
						name: teamMember.user.username,
						userId: teamMember.user.userOsu.id
					});

					newTeam.players.push(newPlayer);
				}

				this.teams.push(this.createTeamGroup(newTeam));
			}

			this.importingFromWyBin = false;
		});
	}

	getPlayersFormArray(index: number): FormArray {
		return this.teams.at(index).get('players') as FormArray;
	}

	private createPlayerGroup(id: number, name: string, userId: number): FormGroup {
		return new FormGroup({
			id: new FormControl(id || null),
			name: new FormControl(name || '', Validators.required),
			userId: new FormControl(userId || null)
		});
	}

	private createTeamGroup(team?: WyTeam): FormGroup {
		const playersFormArray = new FormArray(
			team?.players.map(p => this.createPlayerGroup(p.id, p.name, p.userId)) || []
		);

		return new FormGroup({
			id: new FormControl(team?.id || null),
			name: new FormControl(team?.name || '', Validators.required),
			players: playersFormArray
		});
	}
}
