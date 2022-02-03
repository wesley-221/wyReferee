import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTeamDialogComponent } from 'app/components/dialogs/delete-team-dialog/delete-team-dialog.component';
import { WyTeam } from 'app/models/wytournament/wy-team';
import { WyTeamPlayer } from 'app/models/wytournament/wy-team-player';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';

export interface ITeamDialogData {
	team: WyTeam;
}

@Component({
	selector: 'app-tournament-participants',
	templateUrl: './tournament-participants.component.html',
	styleUrls: ['./tournament-participants.component.scss']
})
export class TournamentParticipantsComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	usersToAdd: string;

	constructor(private dialog: MatDialog, private toastService: ToastService) { }
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
	}

	/**
	 * Delete a team from the tournament
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

				this.tournament.teams.splice(this.tournament.teams.indexOf(team), 1);

				this.toastService.addToast(`Successfully removed the team ${team.name} from the tournament.`);
			}
		});
	}

	/**
	 * Collapse a participant bracket
	 * @param team the participant bracket to collapse
	 */
	collapseParticipant(team: WyTeam) {
		team.collapsed = !team.collapsed;
	}

	/**
	 * Change the name of the team
	 * @param team the team to change the name of
	 * @param event the changed value
	 */
	changeTeamName(team: WyTeam, event: any) {
		team.name = event.target.value;
	}

	/**
	 * Add a player to the given team
	 * @param team the team to add the player to
	 */
	addNewPlayer(team: WyTeam) {
		team.players.push(new WyTeamPlayer());
	}

	/**
	 * Bulk add players to the given team
	 * @param team the team to add the players to
	 */
	addBulkPlayers(team: WyTeam) {
		const allUsers = this.usersToAdd.split(',');

		allUsers.forEach(user => {
			const teamPlayer = new WyTeamPlayer();
			teamPlayer.name = user.trim();

			team.players.push(teamPlayer);
		});

		this.usersToAdd = null;
	}

	/**
	 * Remove a player from the given team
	 * @param team the team to remove a player from
	 * @param player the player to remove from the team
	 */
	removePlayer(team: WyTeam, player: WyTeamPlayer) {
		team.players.splice(team.players.indexOf(player), 1);
	}
}
