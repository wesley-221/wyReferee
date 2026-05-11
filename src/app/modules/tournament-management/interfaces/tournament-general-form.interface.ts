import { TournamentFormat } from "../../../models/wytournament/wy-tournament";

export interface TournamentGeneralForm {
	name: string;
	acronym: string;
	gamemode: number;
	scoreSystem: string;
	protects: boolean;
	format: TournamentFormat;
	teamSize: number;
	defaultTeamMode: number;
	defaultWinCondition: number;
	defaultPlayers: number;
	addrefUsernames: string;
	invalidateBeatmaps: boolean;
	allowDoublePick: boolean;
	lobbyTeamNameWithBrackets: boolean;
}
