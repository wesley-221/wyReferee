import { WyBinMatch } from "./wybin-match";
import { WyBinTournament } from "./wybin-tournament";

export class PersonalSchedule {
	tournament: WyBinTournament;
	matches: WyBinMatch[];

	constructor(init?: Partial<PersonalSchedule>) {
		Object.assign(this, init);
	}

	static makeTrueCopy(personalSchedule: PersonalSchedule): PersonalSchedule {
		const newSchedule = new PersonalSchedule({
			tournament: WyBinTournament.makeTrueCopy(personalSchedule.tournament),
			matches: []
		});

		for (const match of personalSchedule.matches) {
			newSchedule.matches.push(WyBinMatch.makeTrueCopy(match));
		}

		return newSchedule;
	}
}
