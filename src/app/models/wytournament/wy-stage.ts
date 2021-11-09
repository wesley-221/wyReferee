export class WyStage {
	id: string;
	name: string;
	index: number;
	bestOf: number;

	constructor(init?: Partial<WyStage>) {
		Object.assign(this, init);
	}

	public static makeTrueCopy(stage: WyStage): WyStage {
		return new WyStage({
			id: stage.id,
			name: stage.name,
			bestOf: stage.bestOf
		});
	}
}
