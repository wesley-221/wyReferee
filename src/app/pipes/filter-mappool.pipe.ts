import { Pipe, PipeTransform } from '@angular/core';
import { Mappool } from 'app/models/osu-mappool/mappool';

@Pipe({
	name: 'filterMappool'
})
export class FilterMappoolPipe implements PipeTransform {
	transform(mappools: Mappool[], searchValue: string, filterByUser: string): unknown {
		let returnMappools: Mappool[] = [];

		for (const mappool of mappools) {
			returnMappools.push(Mappool.makeTrueCopy(mappool));
		}

		if (searchValue != null) {
			returnMappools = returnMappools.filter(mappool => {
				return mappool.id == parseInt(searchValue) ||
					mappool.name.toLowerCase().includes(searchValue.toLowerCase());
			});
		}

		if (filterByUser != null) {
			returnMappools = returnMappools.filter(mappool => {
				return mappool.createdByUser.username.toLowerCase().includes(filterByUser.toLowerCase());
			});
		}

		return returnMappools;
	}
}
