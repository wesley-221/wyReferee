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
	picked: boolean;
	isSynchronizing: boolean;
}
