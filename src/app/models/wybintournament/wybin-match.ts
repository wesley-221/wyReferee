import { WyBinOpponent } from './wybin-opponent';

export class WyBinMatch {
	id: number;
	qualifierIdentifier: string;
	label: string;
	opponentOne: WyBinOpponent;
	opponentTwo: WyBinOpponent;

	constructor(init?: Partial<WyBinMatch>) {
		Object.assign(this, init);
	}

	getMatchName() {
		if (this.qualifierIdentifier == null) {
			return `#${this.label}: ${this.opponentOne.name} vs. ${this.opponentTwo.name}`;
		}
		else {
			return `Qualifier lobby: ${this.qualifierIdentifier}`;
		}
	}
}
