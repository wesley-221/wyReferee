import { Misc } from 'app/shared/misc';
import { Lobby } from '../lobby';
import { CTMCalculation } from '../score-calculation/calculation-types/ctm-calculation';
import { MultiplayerData } from '../store-multiplayer/multiplayer-data';

export class WyConditionalMessage {
	id: number;
	index: number;
	message: string;
	beatmapResult: boolean;
	beatmapPicked: boolean;
	nextPickMessage: boolean;
	nextPickTiebreakerMessage: boolean;
	matchWonMessage: boolean;

	constructor(init?: Partial<WyConditionalMessage>) {
		this.beatmapResult = false;
		this.beatmapPicked = false;
		this.nextPickMessage = false;
		this.nextPickTiebreakerMessage = false;
		this.matchWonMessage = false;

		Object.assign(this, init);
	}

	public static makeTrueCopy(beatmapResultMessage: WyConditionalMessage): WyConditionalMessage {
		return new WyConditionalMessage({
			id: beatmapResultMessage.id,
			index: beatmapResultMessage.index,
			message: beatmapResultMessage.message,
			beatmapResult: beatmapResultMessage.beatmapResult,
			beatmapPicked: beatmapResultMessage.beatmapPicked,
			nextPickMessage: beatmapResultMessage.nextPickMessage,
			nextPickTiebreakerMessage: beatmapResultMessage.nextPickTiebreakerMessage,
			matchWonMessage: beatmapResultMessage.matchWonMessage
		});
	}

	/**
	 * Translate the message so that the variables are replaced with all the match information
	 *
	 * @param message the message that contains variables to translate
	 * @param match the match information
	 * @param multiplayerLobby the multiplayer lobby information
	 * @param beatmapName the name of the beatmap that was played or picked
	 */
	public static translateMessage(message: string, match: MultiplayerData, multiplayerLobby: Lobby, beatmapName: string): string {
		const replaceWords = {
			'{{\\s{0,}beatmapWinner\\s{0,}}}': match.team_one_score > match.team_two_score ? multiplayerLobby.teamOneName : multiplayerLobby.teamTwoName,
			'{{\\s{0,}beatmap\\s{0,}}}': `[https://osu.ppy.sh/beatmaps/${match.beatmap_id} ${beatmapName}]`,
			'{{\\s{0,}beatmapTeamOneScore\\s{0,}}}': Misc.addDot(match.team_one_score, ' '),
			'{{\\s{0,}beatmapTeamTwoScore\\s{0,}}}': Misc.addDot(match.team_two_score, ' '),
			'{{\\s{0,}scoreDifference\\s{0,}}}': match.team_one_score > match.team_two_score ? Misc.addDot(match.team_one_score - match.team_two_score, ' ') : Misc.addDot(match.team_two_score - match.team_one_score, ' '),
			'{{\\s{0,}teamOneName\\s{0,}}}': multiplayerLobby.teamOneName,
			'{{\\s{0,}teamTwoName\\s{0,}}}': multiplayerLobby.teamTwoName,
			'{{\\s{0,}matchTeamOneScore\\s{0,}}}': multiplayerLobby.getTeamOneScore(),
			'{{\\s{0,}matchTeamTwoScore\\s{0,}}}': multiplayerLobby.getTeamTwoScore(),
			'{{\\s{0,}nextPick\\s{0,}}}': multiplayerLobby.getNextPick(),
			'{{\\s{0,}matchWinner\\s{0,}}}': multiplayerLobby.teamHasWon()
		};

		if (multiplayerLobby.tournament.scoreInterface instanceof CTMCalculation) {
			replaceWords['{{\\s{0,}teamOneHitpoints\\s{0,}}}'] = multiplayerLobby.teamOneHealth;
			replaceWords['{{\\s{0,}teamTwoHitpoints\\s{0,}}}'] = multiplayerLobby.teamTwoHealth;

			for (const modBracket of multiplayerLobby.mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					if (beatmap.beatmapId == match.beatmap_id) {
						replaceWords['{{\\s{0,}damageDealt\\s{0,}}}'] = beatmap.damageAmount;
						break;
					}
				}
			}
		}

		let finalMessage = message;

		for (const regex in replaceWords) {
			finalMessage = finalMessage.replace(new RegExp(regex), replaceWords[regex]);
		}

		return finalMessage;
	}
}
