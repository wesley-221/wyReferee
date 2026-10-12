import { WinConditionCompare, WinConditionWinner } from 'app/models/wytournament/mappool/wy-mod-bracket-map';

export interface TournamentBeatmapForm {
	id: number;
	invalid: boolean;
	beatmapId: number;
	beatmapsetId: number;
	beatmapName: string;
	beatmapUrl: string;
	modifier: number;
	damageAmount: number;
	modCategory: any;
	gamemodeId: number;
	reverseScore: boolean;
	winningConditionCompare: WinConditionCompare;
	winningConditionWinner: WinConditionWinner;
	picked: boolean;
	isSynchronizing: boolean;
}
