import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../../models/tournament/tournament';
import { TournamentService } from '../../../services/tournament.service';
import { ToastService } from '../../../services/toast.service';
import { Team } from '../../../models/tournament/team/team';
import { TeamPlayer } from '../../../models/tournament/team/team-player';

@Component({
	selector: 'app-tournament-create',
	templateUrl: './tournament-create.component.html',
	styleUrls: ['./tournament-create.component.scss']
})

export class TournamentCreateComponent implements OnInit {
	tournamentCreate: Tournament;

	constructor(private tournamentService: TournamentService, private toastService: ToastService) {
		this.tournamentCreate = new Tournament();
	}

	ngOnInit() { }

	/**
	 * Add a team to the tournament
	 */
	addTeam() {
		this.tournamentCreate.addTeam(new Team());
	}

	/**
	 * Delete a team from the tournament
	 * @param team the team to remove
	 */
	deleteTeam(team: Team) {
		this.tournamentCreate.removeTeam(team);
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
	 * Create the tournament
	 */
	createTournament() {
		this.tournamentService.addTournament(this.tournamentCreate);
		this.toastService.addToast(`Successfully created the tournament "${this.tournamentCreate.tournamentName}" with a total of ${this.tournamentCreate.getTeams().length} team(s).`);

		this.tournamentCreate = new Tournament();
	}
}
