export class WyWebhook {
	id: number;
	index: number;
	name: string;

	url: string;

	/**
	 * Whenever a match gets created, an embed will be sent to the channel
	 */
	matchCreation: boolean;

	/**
	 * Whenever a map gets picked by either team, an embed will be sent to the channel
	 */
	picks: boolean;

	/**
	 * Whenever a map gets banned by either team, an embed will be sent to the channel
	 */
	bans: boolean;

	/**
	 * Whenever a button gets pressed by the referee, an embed with the match summary will be sent to the channel
	 */
	matchSummary: boolean;

	/**
	 * Whenever a beatmap finishes, an embed will be sent to the channel
	 */
	matchResult: boolean;

	/**
	 * Whenever
	 */
	finalResult: boolean;

	constructor(init?: Partial<WyWebhook>) {
		Object.assign(this, init);
	}

	public static makeTrueCopy(webhook: WyWebhook): WyWebhook {
		return new WyWebhook({
			id: webhook.id,
			index: webhook.index,
			name: webhook.name,
			url: webhook.url,
			matchCreation: webhook.matchCreation,
			picks: webhook.picks,
			bans: webhook.bans,
			matchSummary: webhook.matchSummary,
			matchResult: webhook.matchResult,
			finalResult: webhook.finalResult
		});
	}
}
