export interface TournamentWebhookForm {
	id: number;
	name: string;
	url: string;
	matchCreation: boolean;
	picks: boolean;
	bans: boolean;
	matchSummary: boolean;
	matchResult: boolean;
	finalResult: boolean;
}
