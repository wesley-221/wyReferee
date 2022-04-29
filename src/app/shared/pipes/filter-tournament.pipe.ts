import { Pipe, PipeTransform } from '@angular/core';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Pipe({
	name: 'filterTournament'
})
export class FilterTournamentPipe implements PipeTransform {
	transform(tournaments: WyTournament[], searchValue: string, filterByUser: string) {
		let returnTournaments: WyTournament[] = [];

		for (const tournament of tournaments) {
			returnTournaments.push(WyTournament.makeTrueCopy(tournament));
		}

		if (searchValue != null) {
			returnTournaments = returnTournaments.filter(tournament => tournament.id == parseInt(searchValue) ||
				tournament.name.toLowerCase().includes(searchValue.toLowerCase()));
		}

		if (filterByUser != null) {
			returnTournaments = returnTournaments.filter(tournament => tournament.createdBy.username.toLowerCase().includes(filterByUser.toLowerCase()));
		}

		return returnTournaments;
	}
}
