import { Injectable } from '@angular/core';
import { MultiplayerLobby } from '../models/store-multiplayer/multiplayer-lobby';
import { StoreService } from './store.service';
import { GetMultiplayerService } from './osu-api/get-multiplayer.service';
import { MultiplayerDataUser } from '../models/store-multiplayer/multiplayer-data-user';
import { Calculations } from '../models/calculations';
import { MultiplayerData } from '../models/store-multiplayer/multiplayer-data';
import { ToastService } from './toast.service';
import { CacheService } from './cache.service';
import { CacheUser } from '../models/cache/cache-user';
import { GetUser } from './osu-api/get-user.service';
import { CacheBeatmap } from '../models/cache/cache-beatmap';
import { GetBeatmap } from './osu-api/get-beatmap.service';
import { MappoolService } from './mappool.service';
import { Calculate } from '../models/score-calculation/calculate';
import { AxSCalculation } from '../models/score-calculation/calculation-types/axs-calculation';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class MultiplayerLobbiesService {
	private allLobbies: MultiplayerLobby[] = [];
	availableLobbyId: number = 0;
	private synchronizeDone: BehaviorSubject<number>;

	constructor(
		private storeService: StoreService,
		private getMultiplayer: GetMultiplayerService,
		private toastService: ToastService,
		private cacheService: CacheService,
		private getUser: GetUser,
		private getBeatmap: GetBeatmap,
		private mappoolService: MappoolService) {
		const allLobbies = storeService.get('lobby');

		for (let lobby in allLobbies) {
			const currentLobby = allLobbies[lobby];

			const newLobby = new MultiplayerLobby();
			newLobby.loadFromJson(currentLobby);
			newLobby.mappool = this.mappoolService.getMappool(newLobby.mappoolId);
			this.allLobbies.push(newLobby);

			this.availableLobbyId = newLobby.lobbyId + 1;
		}

		this.synchronizeDone = new BehaviorSubject(-1);
	}

	/**
	 * Get all the multiplayer lobbies
	 */
	public getAllLobbies(): MultiplayerLobby[] {
		return this.allLobbies;
	}

	/**
	 * Add a new multiplayerlobby
	 * @param multiplayerLobby the multiplayerlobby to add
	 */
	public add(multiplayerLobby: MultiplayerLobby): void {
		this.allLobbies.push(multiplayerLobby);
		this.availableLobbyId++;

		this.storeService.set(`lobby.${multiplayerLobby.lobbyId}`, multiplayerLobby.convertToJson());
	}

	/**
	 * Remove a multiplayerlobby
	 * @param multiplayerLobby the multiplayerlobby to remove
	 */
	public remove(multiplayerLobby: MultiplayerLobby): void {
		this.allLobbies.splice(this.allLobbies.indexOf(multiplayerLobby), 1);

		this.storeService.delete(`lobby.${multiplayerLobby.lobbyId}`);
	}

	/**
	 * Get a multiplayerlobby
	 * @param lobbyId the id of the multiplayerlobby to get
	 */
	public get(lobbyId: number): MultiplayerLobby {
		for (let lobby in this.allLobbies) {
			if (this.allLobbies[lobby].lobbyId == lobbyId) {
				return this.allLobbies[lobby];
			}
		}

		return null;
	}

	/**
	 * Get a multiplayerlobby by an irc channel
	 * @param name the irc channel
	 */
	public getByIrcLobby(name: string): MultiplayerLobby {
		for (let lobby in this.allLobbies) {
			if (`#mp_${this.getMultiplayerIdFromLink(this.allLobbies[lobby].multiplayerLink)}` == name) {
				return this.allLobbies[lobby];
			}
		}
	}

	/**
	 * Update the multiplayerlobby
	 * @param multiplayerLobby the multiplayerlobby to update
	 */
	public update(multiplayerLobby: MultiplayerLobby): void {
		for (let lobby in this.allLobbies) {
			if (this.allLobbies[lobby].lobbyId == multiplayerLobby.lobbyId) {
				this.allLobbies[lobby] = multiplayerLobby;

				this.storeService.set(`lobby.${multiplayerLobby.lobbyId}`, multiplayerLobby.convertToJson());
				return;
			}
		}
	}

	public synchronizeMultiplayerMatch(multiplayerLobby: MultiplayerLobby, showToasts: boolean = true): void {
		this.getMultiplayer.get(multiplayerLobby.multiplayerLink).subscribe(data => {
			multiplayerLobby.teamOneScore = 0;
			multiplayerLobby.teamTwoScore = 0;

			for (let game in data.games) {
				const currentGame = data.games[game];
				const multiplayerData = new MultiplayerData();

				let MODIFIER = 0;

				// Get the mappool if it wasn't set yet
				if (multiplayerLobby.mappool == null) {
					multiplayerLobby.mappool = this.mappoolService.getMappool(multiplayerLobby.mappoolId);
				}

				// Check if there is a mappool selected and if the modifier exists for the beatmap
				if (multiplayerLobby.mappool != null && multiplayerLobby.mappool.modifiers.hasOwnProperty(currentGame.beatmap_id)) {
					MODIFIER = multiplayerLobby.mappool.modifiers[currentGame.beatmap_id].modifier;
				}

				multiplayerData.game_id = currentGame.game_id;
				multiplayerData.beatmap_id = currentGame.beatmap_id;

				const cachedBeatmap: CacheBeatmap = this.cacheService.getCachedBeatmap(multiplayerData.beatmap_id);

				// Check if the beatmap is cached
				if (cachedBeatmap == null) {
					this.getBeatmap.getByBeatmapId(multiplayerData.beatmap_id).subscribe(data => {
						this.cacheService.cacheBeatmap(new CacheBeatmap(`${data.artist} - ${data.title} [${data.version}]`, data.beatmap_id, data.beatmapset_id, `https://osu.ppy.sh/beatmaps/${data.beatmap_id}`));
					});
				}

				// Loop through all the scores
				for (let score in currentGame.scores) {
					const cachedUser: CacheUser = this.cacheService.getCachedUser(currentGame.scores[score].user_id);

					// Check if the user is cached
					if (cachedUser == null) {
						this.getUser.getByUserId(currentGame.scores[score].user_id).subscribe(data => {
							this.cacheService.cacheUser(data);
						});
					}

					const currentScore = currentGame.scores[score],
						newMpDataUser = new MultiplayerDataUser();

					newMpDataUser.user = currentScore.user_id;
					newMpDataUser.score = currentScore.score;
					newMpDataUser.accuracy = Calculations.getAccuracyOfScore(currentScore);
					newMpDataUser.passed = currentScore.pass;
					newMpDataUser.slot = currentScore.slot;

					if (!multiplayerLobby.mapsCountTowardScore.hasOwnProperty(currentGame.game_id)) {
						multiplayerLobby.mapsCountTowardScore[currentGame.game_id] = true;
					}

					multiplayerData.addPlayer(newMpDataUser);
				}

				const calculate = new Calculate();
				const scoreInterface = calculate.getScoreInterface(multiplayerLobby.scoreInterfaceIndentifier);

				scoreInterface.setTeamSize(multiplayerLobby.teamSize);
				scoreInterface.addUserScores(multiplayerData.getPlayers());

				if (scoreInterface.getIdentifier() == "AxS") {
					(<AxSCalculation>scoreInterface).setModifier(MODIFIER);
				}

				multiplayerData.team_one_score = scoreInterface.calculateTeamOneScore();
				multiplayerData.team_two_score = scoreInterface.calculateTeamTwoScore();

				// Add team score if it counts towards the score
				if (multiplayerData.team_one_score > multiplayerData.team_two_score) {
					if (multiplayerLobby.mapsCountTowardScore.hasOwnProperty(multiplayerData.game_id) && multiplayerLobby.mapsCountTowardScore[multiplayerData.game_id] == true) {
						multiplayerLobby.teamOneScore++;
					}
				}
				else {
					if (multiplayerLobby.mapsCountTowardScore.hasOwnProperty(multiplayerData.game_id) && multiplayerLobby.mapsCountTowardScore[multiplayerData.game_id] == true) {
						multiplayerLobby.teamTwoScore++;
					}
				}

				if (multiplayerLobby.existMpData(multiplayerData)) {
					multiplayerLobby.updateMpData(multiplayerData);
				}
				else {
					multiplayerLobby.addMpData(multiplayerData);
				}
			}

			this.synchronizeDone.next(multiplayerLobby.lobbyId);

			// Save multiplayerLobby
			this.update(multiplayerLobby);

			if (showToasts)
				this.toastService.addToast('Successfully synchronized the multiplayer lobby.');
		});
	}

	/**
	 * Check what lobby has been syncrhonized
	 */
	public synchronizeIsCompleted() {
		return this.synchronizeDone.asObservable();
	}

	/**
	 * Get the id of the multiplayer link
	 * @param link the multiplayerlink
	 */
	private getMultiplayerIdFromLink(link: string) {
		const regularExpression = new RegExp(/https:\/\/osu\.ppy\.sh\/community\/matches\/([0-9]+)/).exec(link);

		if (regularExpression) {
			return regularExpression[1];
		}

		return null;
	}
}
