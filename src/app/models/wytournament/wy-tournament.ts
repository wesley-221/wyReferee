import { User } from '../authentication/user';
import { Calculate } from '../score-calculation/calculate';
import { ScoreInterface } from '../score-calculation/calculation-types/score-interface';
import { WyMappool } from './mappool/wy-mappool';
import { WyWebhook } from './wy-webhook';
import { WyTeam } from './wy-team';
import { WyStage } from './wy-stage';
import { WyModBracket } from './mappool/wy-mod-bracket';
import { WyModBracketMap } from './mappool/wy-mod-bracket-map';
import { WyConditionalMessage } from './wy-conditional-message';

export enum TournamentFormat {
	Solo = 'solo',
	Teams = 'teams'
}

export class WyTournament {
	id: number;
	publishId: number;
	name: string;
	acronym: string;
	gamemodeId: number;
	protects: boolean;
	teamSize: number;
	format: TournamentFormat;

	stages: WyStage[];
	stageIndex: number;
	teams: WyTeam[];
	teamIndex: number;
	mappools: WyMappool[];
	mappoolIndex: number;

	scoreInterfaceIdentifier: string;
	scoreInterface: ScoreInterface;

	webhooks: WyWebhook[];
	webhookIndex: number;

	conditionalMessages: WyConditionalMessage[];
	conditionalMessageIndex: number;

	defaultTeamMode: number;
	defaultWinCondition: number;
	defaultPlayers: number;

	invalidateBeatmaps: boolean;
	allowDoublePick: boolean;
	lobbyTeamNameWithBrackets: boolean;

	wyBinTournamentId: number;

	availableTo: User[];

	administrators: User[];

	creationDate: Date;
	updateDate: Date;

	createdBy: User;

	constructor(init?: Partial<WyTournament>) {
		this.stages = [];
		this.teams = [];
		this.stageIndex = 0;
		this.teamIndex = 0;
		this.mappoolIndex = 0;
		this.webhooks = [];
		this.webhookIndex = 0;
		this.conditionalMessages = [];
		this.conditionalMessageIndex = 0;
		this.mappools = [];
		this.invalidateBeatmaps = true;
		this.allowDoublePick = true;
		this.lobbyTeamNameWithBrackets = false;
		this.availableTo = [];
		this.administrators = [];

		Object.assign(this, init);
	}

	/**
	 * Create a true copy of the object
	 *
	 * @param tournament the object to copy
	 */
	public static makeTrueCopy(tournament: WyTournament): WyTournament {
		const calc = new Calculate();

		const newTournament = new WyTournament({
			id: tournament.id,
			publishId: tournament.publishId,
			name: tournament.name,
			acronym: tournament.acronym,
			gamemodeId: tournament.gamemodeId,
			protects: tournament.protects,
			teamSize: tournament.teamSize,
			format: tournament.format,
			scoreInterface: calc.getScoreInterface(tournament.scoreInterfaceIdentifier),
			scoreInterfaceIdentifier: tournament.scoreInterfaceIdentifier,
			updateDate: new Date(tournament.updateDate),
			creationDate: new Date(tournament.creationDate),
			allowDoublePick: tournament.allowDoublePick,
			invalidateBeatmaps: tournament.invalidateBeatmaps,
			lobbyTeamNameWithBrackets: tournament.lobbyTeamNameWithBrackets,
			wyBinTournamentId: tournament.wyBinTournamentId,
			defaultTeamMode: Number(tournament.defaultTeamMode),
			defaultWinCondition: Number(tournament.defaultWinCondition),
			defaultPlayers: Number(tournament.defaultPlayers)
		});

		for (const team in tournament.teams) {
			const newTeam = WyTeam.makeTrueCopy(tournament.teams[team]);

			newTeam.index = newTournament.teamIndex;
			newTournament.teamIndex++;

			newTournament.teams.push(newTeam);
		}

		for (const stage in tournament.stages) {
			const newStage = WyStage.makeTrueCopy(tournament.stages[stage]);

			newStage.index = newTournament.stageIndex;
			newTournament.stageIndex++;

			newTournament.stages.push(newStage);
		}

		for (const webhook in tournament.webhooks) {
			const newWebhook = WyWebhook.makeTrueCopy(tournament.webhooks[webhook]);

			newWebhook.index = newTournament.webhookIndex;
			newTournament.webhookIndex++;

			newTournament.webhooks.push(newWebhook);
		}

		for (const conditionalMessage in tournament.conditionalMessages) {
			const newConditionalMessage = WyConditionalMessage.makeTrueCopy(tournament.conditionalMessages[conditionalMessage]);

			newConditionalMessage.index = newTournament.conditionalMessageIndex;
			newTournament.conditionalMessageIndex++;

			newTournament.conditionalMessages.push(newConditionalMessage);
		}

		for (const mappool in tournament.mappools) {
			const newMappool = WyMappool.makeTrueCopy(tournament.mappools[mappool]);

			newMappool.index = newTournament.mappoolIndex;
			newTournament.mappoolIndex++;

			newTournament.mappools.push(newMappool);
		}

		for (const administrator in tournament.administrators) {
			newTournament.administrators.push(User.makeTrueCopy(tournament.administrators[administrator]));
		}

		for (const user in tournament.availableTo) {
			newTournament.availableTo.push(User.makeTrueCopy(tournament.availableTo[user]));
		}

		if (tournament.createdBy) {
			newTournament.createdBy = User.makeTrueCopy(tournament.createdBy);
		}

		return newTournament;
	}

	/**
	 * Check whether there is a wyBin tournament connected
	 */
	hasWyBinConnected(): boolean {
		return this.wyBinTournamentId != null && this.wyBinTournamentId != undefined;
	}

	/**
	 * Reset the ids of all objects
	 */
	resetAllIds(): void {
		this.id = null;

		for (const mappool of this.mappools) {
			mappool.id = null;
			mappool.publishId = null;

			for (const modBracket of mappool.modBrackets) {
				modBracket.id = null;

				for (const mod of modBracket.mods) {
					mod.id = null;
				}

				for (const map of modBracket.beatmaps) {
					map.id = null;
				}
			}

			for (const category of mappool.modCategories) {
				category.id = null;
			}
		}

		for (const team of this.teams) {
			team.id = null;

			for (const player of team.players) {
				player.id = null;
			}
		}
	}

	/**
	 * Get the mappool with the given id
	 *
	 * @param id the id of the mappool to get
	 */
	getMappoolFromId(id: number): WyMappool {
		for (const mappool in this.mappools) {
			if (this.mappools[mappool].id == id) {
				return this.mappools[mappool];
			}
		}

		return null;
	}

	/**
	 * Get the mappool with the given index
	 *
	 * @param index the index of the mappool to get
	 */
	getMappoolFromIndex(index: number): WyMappool {
		for (const mappool in this.mappools) {
			if (this.mappools[mappool].index == index) {
				return this.mappools[mappool];
			}
		}

		return null;
	}

	/**
	 * Get the modifier of the given beatmap
	 *
	 * @param beatmapId the id of the beatmap to get the modifier from
	 */
	getModifierFromBeatmapId(beatmapId: number): number {
		for (const mappool of this.mappools) {
			for (const modBracket of mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					if (beatmap.beatmapId == beatmapId) {
						return beatmap.modifier;
					}
				}
			}
		}

		return null;
	}

	/**
	 * Get the beatmap from the given id
	 *
	 * @param beatmapId the id of the beatmap to get
	 */
	getBeatmapFromId(beatmapId: number): WyModBracketMap {
		for (const mappool of this.mappools) {
			for (const modBracket of mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					if (beatmap.beatmapId == beatmapId) {
						return beatmap;
					}
				}
			}
		}
	}

	/**
	 * Get the beatmap for the match summary
	 *
	 * @param beatmapId the id of the beatmap to get
	 */
	getBeatmapForMatchSummary(beatmapId: number): string {
		let foundModBracket: WyModBracket = null;
		let foundBeatmap: WyModBracketMap = null;

		for (const mappool of this.mappools) {
			for (const modBracket of mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					if (beatmap.beatmapId == beatmapId) {
						foundModBracket = modBracket;
						foundBeatmap = beatmap;
						break;
					}
				}
			}
		}

		return `[${foundModBracket.acronym}${foundBeatmap.index + 1}](${foundBeatmap.beatmapUrl})`;
	}

	/**
	 * Check if the tournament is a solo tournament
	 */
	isSoloTournament() {
		return this.format == TournamentFormat.Solo;
	}
}
