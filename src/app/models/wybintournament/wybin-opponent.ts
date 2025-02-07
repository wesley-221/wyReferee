export class WyBinOpponent {
	id: number;
	name: string;

	constructor(init?: Partial<WyBinOpponent>) {
		Object.assign(this, init);
	}
}
