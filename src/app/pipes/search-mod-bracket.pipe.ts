import { Pipe, PipeTransform } from '@angular/core';
import { ModBracket } from '../models/osu-mappool/mod-bracket';

@Pipe({
  	name: 'searchmodbracket'
})

export class SearchModBracketPipe implements PipeTransform {
	transform(allModbrackets: ModBracket[], beatmapName: string): any {
		if(beatmapName == '' || beatmapName == undefined) {
			return allModbrackets;
		}

		let returnModBrackets = [];

		for(let bracket in allModbrackets) {
			let currentBracket = ModBracket.makeTrueCopy(allModbrackets[bracket]);

			currentBracket.beatmaps = currentBracket.beatmaps.filter(beatmap => {
				return beatmap.beatmapName.toLowerCase().includes(beatmapName.toLowerCase())
			});

			if(currentBracket.beatmaps.length > 0) {
				returnModBrackets.push(currentBracket);
			}
		}

		return returnModBrackets;
    }
}
