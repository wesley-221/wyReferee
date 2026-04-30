export interface TournamentWebhookForm {
	name: string;
	url: string;
	matchCreation: boolean;
	picks: boolean;
	bans: boolean;
	matchSummary: boolean;
	matchResult: boolean;
	finalResult: boolean;
}
