import { Pipe, PipeTransform } from '@angular/core';
import { Tournament } from 'app/models/tournament/tournament';

@Pipe({
	name: 'filterTournament'
})
export class FilterTournamentPipe implements PipeTransform {
	transform(tournaments: Tournament[], searchValue: string, filterByUser: string): unknown {
		let returnMappools: Tournament[] = [];

		for (const tournament of tournaments) {
			returnMappools.push(Tournament.makeTrueCopy(tournament));
		}

		if (searchValue != null) {
			returnMappools = returnMappools.filter(tournament => {
				return tournament.id == parseInt(searchValue) ||
					tournament.tournamentName.toLowerCase().includes(searchValue.toLowerCase());
			});
		}

		if (filterByUser != null) {
			returnMappools = returnMappools.filter(tournament => {
				return tournament.createdByUser.username.toLowerCase().includes(filterByUser.toLowerCase());
			});
		}

		return returnMappools;
	}
}
