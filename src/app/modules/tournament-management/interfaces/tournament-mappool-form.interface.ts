import { Gamemodes } from "../../../models/osu-models/osu";
import { MappoolType } from "../../../models/wytournament/mappool/wy-mappool";
import { TournamentModBracketForm } from "./tournament-mod-bracket-form.interface";
import { TournamentModCategoryForm } from "./tournament-mod-category-form.interface";

export interface TournamentMappoolForm {
	id: number;
	name: string;
	type: MappoolType;
	gamemodeId: Gamemodes;
	modBrackets: TournamentModBracketForm[];
	modCategories: TournamentModCategoryForm[];
}
