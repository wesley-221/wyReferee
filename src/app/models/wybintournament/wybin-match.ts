import { WyBinOpponent } from './wybin-opponent';

export class WyBinMatch {
	id: number;
	qualifierIdentifier: string;
	label: string;
	date: Date;
	time: string;
	opponentOne: WyBinOpponent;
	opponentTwo: WyBinOpponent;

	constructor(init?: Partial<WyBinMatch>) {
		Object.assign(this, init);
	}

	getMatchName(noLabel: boolean = false): string {
		if (this.qualifierIdentifier == null) {
			if (noLabel) {
				return `${this.opponentOne.name} vs. ${this.opponentTwo.name}`;
			} else {
				return `#${this.label}: ${this.opponentOne.name} vs. ${this.opponentTwo.name}`;
			}
		}
		else {
			return `Qualifier lobby: ${this.qualifierIdentifier}`;
		}
	}

	static makeTrueCopy(copyMatch: WyBinMatch): WyBinMatch {
		const newMatch = new WyBinMatch({
			id: copyMatch.id,
			qualifierIdentifier: copyMatch.qualifierIdentifier,
			label: copyMatch.label,
			date: new Date(copyMatch.date),
			time: copyMatch.time
		});

		if (copyMatch.opponentOne != null) {
			newMatch.opponentOne = new WyBinOpponent({
				id: copyMatch.opponentOne.id,
				name: copyMatch.opponentOne.name
			});
		}

		if (copyMatch.opponentTwo != null) {
			newMatch.opponentTwo = new WyBinOpponent({
				id: copyMatch.opponentTwo.id,
				name: copyMatch.opponentTwo.name
			});
		}

		if ((copyMatch as any).playerOne != null) {
			newMatch.opponentOne = new WyBinOpponent({
				id: (copyMatch as any).playerOne.id,
				name: (copyMatch as any).playerOne.user.username
			});
		}

		if ((copyMatch as any).playerTwo != null) {
			newMatch.opponentTwo = new WyBinOpponent({
				id: (copyMatch as any).playerTwo.id,
				name: (copyMatch as any).playerTwo.user.username
			});
		}

		return newMatch;
	}
}
