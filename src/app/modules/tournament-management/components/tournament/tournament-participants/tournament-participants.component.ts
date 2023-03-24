import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTeamDialogComponent } from 'app/components/dialogs/delete-team-dialog/delete-team-dialog.component';
import { WyTeam } from 'app/models/wytournament/wy-team';
import { WyTeamPlayer } from 'app/models/wytournament/wy-team-player';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';

@Component({
	selector: 'app-tournament-participants',
	templateUrl: './tournament-participants.component.html',
	styleUrls: ['./tournament-participants.component.scss']
})
export class TournamentParticipantsComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	usersToAdd: string;
	teamsToAdd: string;

	teamFilter: string;

	importingFromWyBin: boolean;

	constructor(private dialog: MatDialog, private toastService: ToastService, private tournamentService: TournamentService) {
		this.importingFromWyBin = false;
	}

	ngOnInit(): void { }

	/**
	 * Add a team to the tournament
	 */
	addTeam() {
		const newTeam = new WyTeam();

		newTeam.index = this.tournament.teamIndex;
		this.tournament.teamIndex++;

		this.tournament.teams.push(newTeam);

		this.validationForm.addControl(`tournament-team-name-${newTeam.index}`, new FormControl('', Validators.required));

		if (this.tournament.isSoloTournament()) {
			this.validationForm.addControl(`tournament-player-user-id-${newTeam.index}`, new FormControl(''));
		}
	}

	/**
	 * Delete a team from the tournament
	 *
	 * @param team the team to remove
	 */
	deleteTeam(team: WyTeam) {
		const dialogRef = this.dialog.open(DeleteTeamDialogComponent, {
			data: {
				team
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.validationForm.removeControl(`tournament-team-name-${team.index}`);

				if (this.tournament.isSoloTournament()) {
					this.validationForm.removeControl(`tournament-player-user-id-${team.index}`);
				}

				this.tournament.teams.splice(this.tournament.teams.indexOf(team), 1);

				this.toastService.addToast(`Successfully removed the team ${team.name} from the tournament.`);
			}
		});
	}

	/**
	 * Collapse a participant bracket
	 *
	 * @param team the participant bracket to collapse
	 */
	collapseParticipant(team: WyTeam, event: MouseEvent) {
		if ((event.target as any).localName == 'button' || (event.target as any).localName == 'mat-icon') {
			return;
		}

		team.collapsed = !team.collapsed;
	}

	/**
	 * Change the name of the team
	 *
	 * @param team the team to change the name of
	 * @param event the changed value
	 */
	changeTeamName(team: WyTeam, event: any) {
		team.name = event.target.value;
	}

	/**
	 * Change the id of the user
	 *
	 * @param team the team to change the user id of
	 * @param event the changed value
	 */
	changePlayerUserId(team: WyTeam, event: any) {
		team.userId = event.target.value;
	}

	/**
	 * Add a player to the given team
	 *
	 * @param team the team to add the player to
	 */
	addNewPlayer(team: WyTeam) {
		team.players.push(new WyTeamPlayer());
	}

	/**
	 * Bulk add players to the given team
	 *
	 * @param team the team to add the players to
	 */
	addBulkPlayers(team: WyTeam) {
		const allUsers = this.usersToAdd.split('\n');

		allUsers.forEach(user => {
			const teamPlayer = new WyTeamPlayer();
			const [username, userId] = user.trim().split(',');

			teamPlayer.name = username.trim();
			teamPlayer.userId = parseInt(userId.trim());

			team.players.push(teamPlayer);
		});

		this.usersToAdd = null;
	}

	/**
	 * Bulk add teams to the tournament
	 */
	addBulkTeams(): void {
		const allTeams = this.teamsToAdd.split('\n');

		allTeams.forEach(team => {
			const newTeam = new WyTeam();
			newTeam.name = team.trim();

			newTeam.index = this.tournament.teamIndex;
			this.tournament.teamIndex++;

			this.validationForm.addControl(`tournament-team-name-${newTeam.index}`, new FormControl(newTeam.name, Validators.required));

			if (this.tournament.isSoloTournament()) {
				this.validationForm.addControl(`tournament-player-user-id-${newTeam.index}`, new FormControl(''));
			}

			this.tournament.teams.push(newTeam);
		});

		this.teamsToAdd = null;
	}

	/**
	 * Bulk add players to the tournament
	 */
	addBulkPlayersSoloTournament(): void {
		const allTeams = this.teamsToAdd.split('\n');

		allTeams.forEach(team => {
			const newTeam = new WyTeam();
			const [username, userId] = team.trim().split(',');

			newTeam.name = username.trim();
			newTeam.userId = parseInt(userId.trim());

			newTeam.index = this.tournament.teamIndex;
			this.tournament.teamIndex++;

			this.validationForm.addControl(`tournament-team-name-${newTeam.index}`, new FormControl(newTeam.name, Validators.required));

			if (this.tournament.isSoloTournament()) {
				this.validationForm.addControl(`tournament-player-user-id-${newTeam.index}`, new FormControl(newTeam.userId));
			}

			this.tournament.teams.push(newTeam);
		});

		this.teamsToAdd = null;
	}

	/**
	 * Remove a player from the given team
	 *
	 * @param team the team to remove a player from
	 * @param player the player to remove from the team
	 */
	removePlayer(team: WyTeam, player: WyTeamPlayer) {
		team.players.splice(team.players.indexOf(player), 1);
	}

	/**
	 * Import players from the given wyBin tournament
	 */
	importWyBinPlayers(): void {
		this.importingFromWyBin = true;

		this.tournamentService.getWyBinTournamentPlayers(this.tournament.wyBinTournamentId).subscribe((players: any) => {
			for (const player of players) {
				const newTeam = new WyTeam({
					name: player.user.username,
					userId: player.user.userOsu.id,
					index: this.tournament.teamIndex,
					collapsed: true
				});

				this.tournament.teamIndex++;

				this.validationForm.addControl(`tournament-team-name-${newTeam.index}`, new FormControl(newTeam.name, Validators.required));
				this.validationForm.addControl(`tournament-player-user-id-${newTeam.index}`, new FormControl(newTeam.userId));

				this.tournament.teams.push(newTeam);
			}

			this.importingFromWyBin = false;
		});
	}

	/**
	 * Import teams from the given wyBin tournament
	 */
	importWyBinTeams(): void {
		this.importingFromWyBin = true;

		this.tournamentService.getWyBinTournamentTeams(this.tournament.wyBinTournamentId).subscribe((teams: any) => {
			for (const team of teams) {
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

				this.validationForm.addControl(`tournament-team-name-${newTeam.index}`, new FormControl(newTeam.name, Validators.required));

				this.tournament.teams.push(newTeam);
			}

			this.importingFromWyBin = false;
		});
	}
}
