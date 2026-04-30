export interface TournamentConditionalMessageForm {
	id: number;
	message: string;
	beatmapResult: boolean;
	beatmapPicked: boolean;
	nextPickMessage: boolean;
	nextPickTiebreakerMessage: boolean;
	matchWonMessage: boolean;
}
