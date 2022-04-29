import { Pipe, PipeTransform } from '@angular/core';
import { WyTeam } from 'app/models/wytournament/wy-team';

@Pipe({
	name: 'filterTeam'
})
export class FilterTeamPipe implements PipeTransform {
	transform(teams: WyTeam[], searchValue: string) {
		const returnTeams: WyTeam[] = [];

		for (const team of teams) {
			if (searchValue == undefined || searchValue == null || searchValue == '') {
				returnTeams.push(team);
			}
			else {
				if (team.name.toLowerCase().includes(searchValue.toLowerCase())) {
					returnTeams.push(team);
				}
			}
		}

		return returnTeams;
	}
}
