import { MultiplayerGame } from './multiplayer-game';

export class MultiplayerMatch {
	match_id: number;
	name: string;
	start_time: Date;
	end_time: Date;

	games: MultiplayerGame[];

	constructor(init?: Partial<MultiplayerMatch>) {
		this.games = [];

		Object.assign(this, init);
	}
}
