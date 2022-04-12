import { Pipe, PipeTransform } from '@angular/core';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Pipe({
	name: 'filterTournament'
})
export class FilterTournamentPipe implements PipeTransform {
	transform(tournaments: WyTournament[], searchValue: string, filterByUser: string) {
		let returnMappools: WyTournament[] = [];

		for (const tournament of tournaments) {
			returnMappools.push(WyTournament.makeTrueCopy(tournament));
		}

		if (searchValue != null) {
			returnMappools = returnMappools.filter(tournament => tournament.id == parseInt(searchValue) ||
				tournament.name.toLowerCase().includes(searchValue.toLowerCase()));
		}

		if (filterByUser != null) {
			returnMappools = returnMappools.filter(tournament => tournament.createdBy.username.toLowerCase().includes(filterByUser.toLowerCase()));
		}

		return returnMappools;
	}
}
