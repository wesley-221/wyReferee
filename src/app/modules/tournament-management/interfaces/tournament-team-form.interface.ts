import { TournamentPlayerForm } from "./tournament-player-form.interface";

export interface TournamentTeamForm {
	id: number;
	name: string;
	players: TournamentPlayerForm[];
}
