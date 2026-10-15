import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTeamDialogComponent } from 'app/components/dialogs/delete-team-dialog/delete-team-dialog.component';
import { WyTeam } from 'app/models/wytournament/wy-team';
import { WyTeamPlayer } from 'app/models/wytournament/wy-team-player';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastType } from 'app/models/toast';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { TournamentEditStateService } from '../../../../services/tournament-edit-state.service';
import { debounceTime, filter } from 'rxjs';
import { ImportWybinParticipantsDialogComponent } from '../../../../../../components/dialogs/import-wybin-participants-dialog/import-wybin-participants-dialog.component';

@Component({
	selector: 'app-tournament-participants',
	templateUrl: './tournament-participants.component.html',
	styleUrls: ['./tournament-participants.component.scss']
})
export class TournamentParticipantsComponent implements OnInit {
	tournament: WyTournament;
	form: FormGroup;

	usersToAdd: string;
	teamsToAdd: string;

	teamFilter: string;

	importingFromWyBin: boolean;
	private initialized = false;

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
	}

	ngOnInit(): void {
		this.tournamentEditStateService.getDraft$()
			.pipe(filter(v => !!v))
			.subscribe(tournament => {
				this.tournament = tournament;

				if (this.initialized == true) {
					return;
				}

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

				this.initialized = true;
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
		const allUsers = (this.usersToAdd || '').split('\n')
			.map(user => user.trim())
			.filter(user => user.length > 0);

		const parsedUsers = allUsers.map(user => {
			const [username, rawUserId] = user.split(',');
			const userId = rawUserId?.trim();

			return {
				name: username?.trim() || '',
				userId: userId && /^\d+$/.test(userId) ? parseInt(userId, 10) : null,
				isValid: !!username?.trim() && (!userId || /^\d+$/.test(userId))
			};
		});

		if (parsedUsers.some(user => !user.isValid)) {
			this.toastService.addToast('Players must be entered one per line as "name, user id". Check the names and numeric user ids, then try again.', ToastType.Error);
			return;
		}

		parsedUsers.forEach(user => {
			(teamGroup.get('players') as FormArray).push(this.createPlayerGroup(null, user.name, user.userId));
		});

		this.usersToAdd = '';
	}

	addBulkTeams(teamLines: string): void {
		const allTeams = (teamLines || '').split('\n')
			.map(team => team.trim())
			.filter(team => team.length > 0);

		const parsedTeams = allTeams.map(teamLine => {
			const [teamName, ...players] = teamLine.split(',').map(value => value.trim());
			const validPlayers = players.length % 2 === 0 && players.every((value, index) => {
				if (index % 2 === 0) {
					return value.length > 0;
				}

				return value.length === 0 || /^\d+$/.test(value);
			});

			return { teamName, players, isValid: !!teamName && validPlayers };
		});

		if (parsedTeams.some(team => !team.isValid)) {
			this.toastService.addToast('Each team line needs a team name followed by player name and user id pairs. Check the format and try again.', ToastType.Error);
			return;
		}

		parsedTeams.forEach(({ teamName, players }) => {
			const newTeam = new WyTeam({
				name: teamName,
				index: this.tournament.teamIndex,
				collapsed: true
			});

			for (let i = 0; i < players.length; i += 2) {
				newTeam.players.push(new WyTeamPlayer({
					name: players[i],
					userId: players[i + 1] ? parseInt(players[i + 1], 10) : null
				}));
			}

			this.teams.push(this.createTeamGroup(newTeam));
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
		const dialogRef = this.dialog.open(ImportWybinParticipantsDialogComponent, {
			data: {
				type: 'players'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.importingFromWyBin = true;

				this.clearForm();

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
		});
	}

	importWyBinTeams(): void {
		const dialogRef = this.dialog.open(ImportWybinParticipantsDialogComponent, {
			data: {
				type: 'teams'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.importingFromWyBin = true;

				this.clearForm();

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
		});
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

	private clearForm() {
		this.players.clear();
		this.teams.clear();
	}
}
