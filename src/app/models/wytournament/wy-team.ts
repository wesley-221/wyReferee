import { WyTeamPlayer } from "./wy-team-player";

export class WyTeam {
	id: number;
	name: string;
	collapsed: boolean;
	players: WyTeamPlayer[];
	validateIndex: number;

	constructor(init?: Partial<WyTeam>) {
		this.players = [];

		Object.assign(this, init);
	}

	/**
	 * Create a true copy of the object
	 * @param team the object to copy
	 */
	public static makeTrueCopy(team: WyTeam): WyTeam {
		const newTeam = new WyTeam({
			id: team.id,
			name: team.name,
			collapsed: team.collapsed,
			validateIndex: team.validateIndex
		});

		for (const player in team.players) {
			newTeam.players.push(WyTeamPlayer.makeTrueCopy(team.players[player]));
		}

		return newTeam;
	}
}
