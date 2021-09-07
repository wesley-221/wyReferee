export class MultiplayerGameScore {
	slot: number;
	team: number;
	user_id: number;
	score: number;
	maxcombo: number;
	rank: number;
	count50: number;
	count100: number;
	count300: number;
	countmiss: number;
	countgeki: number;
	countkatu: number;
	perfect: number;
	pass: number;
	enabled_mods: any; // unsure of data type

	constructor(init?: Partial<MultiplayerGameScore>) {
		Object.assign(this, init);
	}
}
