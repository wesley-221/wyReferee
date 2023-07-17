export class WyStage {
	id: string;
	name: string;
	index: number;
	hitpoints: number;
	bestOf: number;

	constructor(init?: Partial<WyStage>) {
		Object.assign(this, init);
	}

	public static makeTrueCopy(stage: WyStage): WyStage {
		return new WyStage({
			id: stage.id,
			name: stage.name,
			hitpoints: stage.hitpoints,
			bestOf: stage.bestOf
		});
	}

	public static parseFromWyBin(stage: any): WyStage {
		return new WyStage({
			name: stage.name,
			bestOf: stage.bestOf
		});
	}
}
