import { WyModCategory } from './wy-mod-category';
import { MultiplayerData } from '../../store-multiplayer/multiplayer-data';

export type WinConditionCompare = 'score' | 'accuracy' | 'misses';
export type WinConditionWinner = 'highest' | 'lowest';

export class WyModBracketMap {
	id: number;
	index: number;
	invalid: boolean;

	beatmapId: number;
	beatmapsetId: number;
	beatmapName: string;
	beatmapUrl: string;

	modifier: number;
	damageAmount: number;
	modCategory: WyModCategory;
	gamemodeId: number;

	reverseScore: boolean;
	winningConditionCompare: WinConditionCompare;
	winningConditionWinner: WinConditionWinner;
	picked: boolean;
	isSynchronizing: boolean;

	constructor(init?: Partial<WyModBracketMap>) {
		this.winningConditionCompare = init?.winningConditionCompare ?? 'score';
		this.winningConditionWinner = init?.winningConditionWinner ?? (init?.reverseScore ? 'lowest' : 'highest');
		Object.assign(this, init);
	}

	/**
	 * Create a true copy of the object
	 *
	 * @param mod the object to copy
	 */
	public static makeTrueCopy(modBracketMap: WyModBracketMap): WyModBracketMap {
		return new WyModBracketMap({
			id: modBracketMap.id,
			index: modBracketMap.index,
			invalid: modBracketMap.invalid,
			beatmapId: modBracketMap.beatmapId,
			beatmapsetId: modBracketMap.beatmapsetId,
			beatmapName: modBracketMap.beatmapName,
			beatmapUrl: modBracketMap.beatmapUrl,
			modifier: modBracketMap.modifier,
			damageAmount: modBracketMap.damageAmount,
			modCategory: modBracketMap.modCategory != undefined ? WyModCategory.makeTrueCopy(modBracketMap.modCategory) : null,
			gamemodeId: modBracketMap.gamemodeId,
			reverseScore: modBracketMap.reverseScore,
			winningConditionCompare: modBracketMap.winningConditionCompare,
			winningConditionWinner: modBracketMap.winningConditionWinner,
			picked: modBracketMap.picked,
			isSynchronizing: modBracketMap.isSynchronizing
		});
	}

	/**
	 * Get the url of cover image of the beatmap
	 */
	public getCoverImage(): string {
		return `https://assets.ppy.sh/beatmaps/${this.beatmapsetId}/covers/cover.jpg`;
	}

	/**
	 * Get win condition values from the given beatmap and match
	 */
	public static getComparisonValues(beatmap: WyModBracketMap, match: MultiplayerData): {
		compare: WinConditionCompare;
		winner: WinConditionWinner;
		teamOneValue: number;
		teamTwoValue: number;
		difference: number;
	} {
		const compare: WinConditionCompare = beatmap?.winningConditionCompare ?? 'score';
		const winner: WinConditionWinner = beatmap?.winningConditionWinner ?? (beatmap?.reverseScore ? 'lowest' : 'highest');

		let teamOneValue: number;
		let teamTwoValue: number;

		if (compare === 'accuracy') {
			teamOneValue = match.getTeamOneAccuracy();
			teamTwoValue = match.getTeamTwoAccuracy();
		}
		else if (compare === 'misses') {
			teamOneValue = match.getTeamOneMisses();
			teamTwoValue = match.getTeamTwoMisses();
		}
		else {
			teamOneValue = match.team_one_score ?? 0;
			teamTwoValue = match.team_two_score ?? 0;
		}

		const difference = Math.abs(teamOneValue - teamTwoValue);

		return {
			compare,
			winner,
			teamOneValue,
			teamTwoValue,
			difference
		};
	}

	/**
	 * Get the winning team based on the win conditions
	 */
	public static getWinningTeam(beatmap: WyModBracketMap, match: MultiplayerData): 'teamOne' | 'teamTwo' | 'tie' {
		if (!match) {
			return 'tie';
		}

		const { winner, teamOneValue, teamTwoValue } = WyModBracketMap.getComparisonValues(beatmap, match);

		if (teamOneValue === teamTwoValue) {
			return 'tie';
		}

		if (winner === 'lowest') {
			return teamOneValue < teamTwoValue ? 'teamOne' : 'teamTwo';
		}
		else {
			return teamOneValue > teamTwoValue ? 'teamOne' : 'teamTwo';
		}
	}
}
