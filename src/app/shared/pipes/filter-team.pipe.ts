import { Pipe, PipeTransform } from '@angular/core';
import { WyTeam } from 'app/models/wytournament/wy-team';

@Pipe({
	name: 'filterTeam'
})
export class FilterTeamPipe implements PipeTransform {
	transform(teams: WyTeam[], searchValue: string) {
		let returnTeams: WyTeam[] = [];

		if (searchValue == null || searchValue == undefined || searchValue == '') {
			return teams;
		}

		returnTeams = teams;

		if (searchValue != null) {
			returnTeams = returnTeams.filter(team => team.name.toLowerCase().includes(searchValue.toLowerCase()));
		}

		return returnTeams;
	}
}
