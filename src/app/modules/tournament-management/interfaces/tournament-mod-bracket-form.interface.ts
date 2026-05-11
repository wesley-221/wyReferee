import { TournamentBeatmapForm } from "./tournament-beatmap-form.interface";
import { TournamentModForm } from "./tournament-mod-form.interface";

export interface TournamentModBracketForm {
	id: number;
	name: string;
	acronym: string;
	mods: TournamentModForm[];
	beatmaps: TournamentBeatmapForm[];
}
