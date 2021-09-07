import { Pipe, PipeTransform } from '@angular/core';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';

@Pipe({
	name: 'searchmodbracket'
})

export class SearchModBracketPipe implements PipeTransform {
	transform(allModbrackets: WyModBracket[], beatmapName: string): any {
		if (beatmapName == '' || beatmapName == undefined) {
			return allModbrackets;
		}

		const returnModBrackets: WyModBracket[] = [];

		for (const bracket in allModbrackets) {
			const currentBracket = WyModBracket.makeTrueCopy(allModbrackets[bracket]);

			currentBracket.beatmaps = currentBracket.beatmaps.filter(beatmap => {
				return beatmap.beatmapName.toLowerCase().includes(beatmapName.toLowerCase())
			});

			if (currentBracket.beatmaps.length > 0) {
				returnModBrackets.push(currentBracket);
			}
		}

		return returnModBrackets;
	}
}
