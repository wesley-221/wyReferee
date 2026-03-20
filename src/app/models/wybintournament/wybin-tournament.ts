import { WyBinStage } from "./wybin-stage";

export class WyBinTournament {
	idd: number;
	name: string;
	stages: WyBinStage[];

	constructor(init?: Partial<WyBinTournament>) {
		Object.assign(this, init);
	}

	static makeTrueCopy(copyTournament: WyBinTournament) {
		const newTournament = new WyBinTournament({
			idd: copyTournament.idd,
			name: copyTournament.name,
			stages: []
		});

		for (const stage of copyTournament.stages) {
			newTournament.stages.push(WyBinStage.makeTrueCopy(stage));
		}

		return newTournament;
	}
}
