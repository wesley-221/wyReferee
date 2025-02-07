export class WyStage {
	id: string;
	wyBinStageId: number;
	name: string;
	index: number;
	hitpoints: number;
	bestOf: number;
	bans: number;

	constructor(init?: Partial<WyStage>) {
		Object.assign(this, init);
	}

	public static makeTrueCopy(stage: WyStage): WyStage {
		return new WyStage({
			id: stage.id,
			wyBinStageId: stage.wyBinStageId,
			name: stage.name,
			hitpoints: stage.hitpoints,
			bestOf: stage.bestOf,
			bans: stage.bans
		});
	}

	public static parseFromWyBin(stage: any): WyStage {
		return new WyStage({
			wyBinStageId: stage.id,
			name: stage.name,
			bestOf: stage.bestOf,
			bans: stage.bans
		});
	}
}
