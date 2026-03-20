import { WyBinMatch } from './wybin-match';

export class WyBinStage {
	id: number;
	name: string;
	qualifierStage: boolean;
	matches: WyBinMatch[];

	wyRefereeId: number;

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
			const newMatch = WyBinMatch.makeTrueCopy(match);

			newStage.matches.push(newMatch);
		}

		return newStage;
	}
}
