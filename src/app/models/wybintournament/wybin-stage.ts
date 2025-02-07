import { WyBinMatch } from './wybin-match';
import { WyBinOpponent } from './wybin-opponent';

export class WyBinStage {
	id: number;
	name: string;
	qualifierStage: boolean;
	matches: WyBinMatch[];

	constructor(init?: Partial<WyBinStage>) {
		Object.assign(this, init);
	}

	static makeTrueCopy(copyStage: WyBinStage) {
		const newStage = new WyBinStage({
			id: copyStage.id,
			name: copyStage.name,
			qualifierStage: copyStage.qualifierStage,
			matches: []
		});

		for (const match of copyStage.matches) {
			const newMatch = new WyBinMatch({
				id: match.id,
				label: match.label,
				qualifierIdentifier: match.qualifierIdentifier
			});

			if (newStage.qualifierStage == false) {
				newMatch.opponentOne = new WyBinOpponent({
					id: match.opponentOne.id,
					name: match.opponentOne.name
				});

				newMatch.opponentTwo = new WyBinOpponent({
					id: match.opponentTwo.id,
					name: match.opponentTwo.name
				});
			}

			newStage.matches.push(newMatch);
		}

		return newStage;
	}
}
