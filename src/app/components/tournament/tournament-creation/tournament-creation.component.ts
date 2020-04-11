import { Component, OnInit, Input } from '@angular/core';
import { Calculate } from '../../../models/score-calculation/calculate';
import { ScoreInterface } from '../../../models/score-calculation/calculation-types/score-interface';
import { Tournament } from '../../../models/tournament/tournament';
import { TeamPlayer } from '../../../models/tournament/team/team-player';
import { Team } from '../../../models/tournament/team/team';

@Component({
	selector: 'app-tournament-creation',
	templateUrl: './tournament-creation.component.html',
	styleUrls: ['./tournament-creation.component.scss']
})
export class TournamentCreationComponent implements OnInit {
	@Input() tournament: Tournament;

	calculateScoreInterfaces: Calculate;
	selectedScoreInterface: ScoreInterface;

	constructor() {
		this.calculateScoreInterfaces = new Calculate();
	}

	ngOnInit() {
		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(this.tournament.tournamentScoreInterfaceIdentifier);
	}

	/**
	 * Add a team to the tournament
	 */
	addTeam() {
		this.tournament.addTeam(new Team());
	}

	/**
	 * Delete a team from the tournament
	 * @param team the team to remove
	 */
	deleteTeam(team: Team) {
		this.tournament.removeTeam(team);
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
		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface((<any>event.target).value);
		this.tournament.teamSize = this.selectedScoreInterface.getTeamSize();
		this.tournament.tournamentScoreInterfaceIdentifier = this.selectedScoreInterface.getIdentifier();
	}
}
