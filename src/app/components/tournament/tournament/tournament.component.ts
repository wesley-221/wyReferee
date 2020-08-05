import { Component, OnInit, Input } from '@angular/core';
import { Calculate } from '../../../models/score-calculation/calculate';
import { Tournament } from '../../../models/tournament/tournament';
import { TeamPlayer } from '../../../models/tournament/team/team-player';
import { Team } from '../../../models/tournament/team/team';
import { ToastService } from '../../../services/toast.service';
declare var $: any;

@Component({
	selector: 'app-tournament',
	templateUrl: './tournament.component.html',
	styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {
	@Input() tournament: Tournament;

	calculateScoreInterfaces: Calculate;

	dialogMessage: string;
	dialogAction: number = 0;
	teamToRemove: Team;

	constructor(private toastService: ToastService) {
		this.calculateScoreInterfaces = new Calculate();
	}

	ngOnInit() { }

	/**
	 * Add a team to the tournament
	 */
	addTeam() {
		this.tournament.addTeam(new Team());
	}

	openDialog(team: Team) {
		this.dialogMessage = `Are you sure you want to remove "${team.teamName}" from the tournament?`;
		this.teamToRemove = team;

		setTimeout(() => {
			$(`#dialog`).modal('toggle');
		}, 1);
	}

	/**
	 * Delete a team from the tournament
	 * @param team the team to remove
	 */
	deleteTeam(team: Team) {
		this.tournament.removeTeam(team);
		this.toastService.addToast(`Successfully removed the team "${team.teamName}" from the tournament.`);

		$(`#dialog`).modal('toggle');
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
	 * Change the score interface
	 * @param event
	 */
	changeScoreInterface(event: Event) {
		let selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface((<any>event.target).value);
		this.tournament.scoreInterface = selectedScoreInterface;
		this.tournament.teamSize = selectedScoreInterface.getTeamSize();
	}
}
