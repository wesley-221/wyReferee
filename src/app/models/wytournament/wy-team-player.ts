export class WyTeamPlayer {
	id: number;
	name: string;

	constructor(init?: Partial<WyTeamPlayer>) {
		Object.assign(this, init);
	}

	/**
	 * Create a true copy of the object
	 * @param teamPlayer the object to copy
	 */
	public static makeTrueCopy(teamPlayer: WyTeamPlayer): WyTeamPlayer {
		return new WyTeamPlayer({
			id: teamPlayer.id,
			name: teamPlayer.name
		});
	}
}
