import { Component, OnInit, Input } from '@angular/core';
import { Team } from 'app/models/tournament/team/team';
import { Tournament } from 'app/models/tournament/tournament';
import { ToastService } from 'app/services/toast.service';
import { TeamPlayer } from 'app/models/tournament/team/team-player';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTeamComponent } from 'app/components/dialogs/delete-team/delete-team.component';

export interface DeleteTeamDialogData {
	team: Team;
}

@Component({
	selector: 'app-team',
	templateUrl: './team.component.html',
	styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
	@Input() team: Team;
	@Input() tournament: Tournament;
	@Input() validationForm: FormGroup;

	constructor(private toastService: ToastService, private dialog: MatDialog) { }

	ngOnInit(): void { }

	/**
	 * Delete a team from the tournament
	 * @param team the team to remove
	 */
	deleteTeam(team: Team) {
		const dialogRef = this.dialog.open(DeleteTeamComponent, {
			data: {
				team
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.validationForm.removeControl(`tournament-team-name-${team.validateIndex}`);
				this.tournament.removeTeam(team);
				this.toastService.addToast(`Successfully removed the team "${team.teamName}" from the tournament.`);
			}
		});
	}

	/**
	 * Collapse a team bracket
	 * @param team the team bracket to collapse
	 */
	collapseBracket(team: Team) {
		team.collapsed = !team.collapsed;
	}

	/**
	 * Add a player to the given team
	 * @param team the team to add the player to
	 */
	addNewPlayer(team: Team) {
		team.addPlayer(new TeamPlayer());
	}

	/**
	 * Remove a player from the given team
	 * @param team the team to remove a player from
	 * @param player the player to remove from the team
	 */
	removePlayer(team: Team, player: TeamPlayer) {
		team.removePlayer(player);
	}

	/**
	 * Change the name of the team
	 * @param team
	 * @param event
	 */
	changeTeamName(team: Team, event: any) {
		team.teamName = event.target.value;
	}

	getValidation(key: string): any {
		return this.validationForm.get(key);
	}
}
