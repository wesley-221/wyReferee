import { Mods } from '../osu-models/osu';

export class MultiplayerDataUser {
	accuracy: number;
	mods: number;
	passed: number;
	score: number;
	user: number;
	slot: number;
	caption: string;

	constructor(init?: Partial<MultiplayerDataUser>) {
		this.score = 0;
		this.accuracy = 0;

		Object.assign(this, init);
	}

	public static makeTrueCopy(multiplayerDataUser: MultiplayerDataUser): MultiplayerDataUser {
		return new MultiplayerDataUser({
			accuracy: multiplayerDataUser.accuracy,
			mods: multiplayerDataUser.mods,
			passed: multiplayerDataUser.passed,
			score: multiplayerDataUser.score,
			user: multiplayerDataUser.user,
			slot: multiplayerDataUser.slot,
			caption: multiplayerDataUser.caption
		});
	}
}
