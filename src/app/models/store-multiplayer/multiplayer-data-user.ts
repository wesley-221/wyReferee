import { Mods } from '../osu-models/osu';

export class MultiplayerDataUser {
	accuracy: number;
	mods: Mods;
	passed: number;
	score: number;
	user: number;
	slot: number;
	caption: string;

	constructor() {
		this.score = 0;
		this.accuracy = 0;
	}
}
