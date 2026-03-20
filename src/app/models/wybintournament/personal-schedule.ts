import { WyBinMatch } from "./wybin-match";
import { WyBinTournament } from "./wybin-tournament";

export class PersonalSchedule {
	tournament: WyBinTournament;
	matches: WyBinMatch[];

	constructor(init?: Partial<PersonalSchedule>) {
		Object.assign(this, init);
	}

	static makeTrueCopy(personalSchedule: PersonalSchedule): PersonalSchedule {
		return new PersonalSchedule({
			tournament: WyBinTournament.makeTrueCopy(personalSchedule.tournament),
			matches: personalSchedule.matches.map(match => WyBinMatch.makeTrueCopy(match))
		});
	}
}
