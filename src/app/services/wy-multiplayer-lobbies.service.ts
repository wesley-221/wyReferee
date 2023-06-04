import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheBeatmap } from 'app/models/cache/cache-beatmap';
import { CacheUser } from 'app/models/cache/cache-user';
import { Calculations } from 'app/models/calculations';
import { Lobby } from 'app/models/lobby';
import { MultiplayerMatch } from 'app/models/osu-models/multiplayer-match';
import { Calculate } from 'app/models/score-calculation/calculate';
import { AxSCalculation } from 'app/models/score-calculation/calculation-types/axs-calculation';
import { OMLScoreCalculation } from 'app/models/score-calculation/calculation-types/oml-score-calculation';
import { ThreeCwcScoreCalculation } from 'app/models/score-calculation/calculation-types/three-cwc-score-calculation';
import { MultiplayerData } from 'app/models/store-multiplayer/multiplayer-data';
import { MultiplayerDataUser } from 'app/models/store-multiplayer/multiplayer-data-user';
import { WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WyMysteryMappoolHelper } from 'app/models/wytournament/mappool/wy-mystery-mappool-helper';
import { AppConfig } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CacheService } from './cache.service';
import { GenericService } from './generic.service';
import { MultiplayerLobbyPlayersService } from './multiplayer-lobby-players.service';
import { GetBeatmap } from './osu-api/get-beatmap.service';
import { GetMultiplayerService } from './osu-api/get-multiplayer.service';
import { GetUser } from './osu-api/get-user.service';
import { StoreService } from './store.service';
import { ToastService } from './toast.service';
import { TournamentService } from './tournament.service';
import { WebhookService } from './webhook.service';

@Injectable({
	providedIn: 'root'
})
export class WyMultiplayerLobbiesService {
	allLobbies: Lobby[];
	availableLobbyId: number;
	synchronizeDone$: BehaviorSubject<Lobby>;

	constructor(
		private storeService: StoreService,
		private multiplayerService: GetMultiplayerService,
		private beatmapService: GetBeatmap,
		private osuUserService: GetUser,
		private tournamentService: TournamentService,
		private cacheService: CacheService,
		private toastService: ToastService,
		private webhookService: WebhookService,
		private http: HttpClient,
		private genericService: GenericService,
		private multiplayerLobbyPlayersService: MultiplayerLobbyPlayersService) {
		this.allLobbies = [];
		this.availableLobbyId = 0;

		this.synchronizeDone$ = new BehaviorSubject(null);

		this.genericService.getCacheHasBeenChecked().subscribe(checked => {
			if (checked == true) {
				const allLobbies = storeService.get('lobby');

				for (const lobby in allLobbies) {
					const newLobby = Lobby.makeTrueCopy(allLobbies[lobby]);

					this.tournamentService.tournamentsHaveBeenInitialized().subscribe(initialized => {
						if (initialized == true) {
							newLobby.tournament = this.tournamentService.getTournamentById(newLobby.tournamentId);
						}
					});

					this.multiplayerLobbyPlayersService.createNewMultiplayerLobbyObject(newLobby.lobbyId);

					this.allLobbies.push(newLobby);
					this.availableLobbyId = newLobby.lobbyId + 1;
				}
			}
		});
	}

	/**
	 * Get all multiplayer lobbies
	 */
	getAllLobbies(): Lobby[] {
		return this.allLobbies;
	}

	/**
	 * Add a new multiplayer lobby
	 *
	 * @param multiplayerLobby the lobby to add
	 */
	addMultiplayerLobby(multiplayerLobby: Lobby): void {
		this.allLobbies.push(multiplayerLobby);
		this.availableLobbyId++;

		this.storeService.set(`lobby.${multiplayerLobby.lobbyId}`, multiplayerLobby);
	}

	/**
	 * Get a multiplayer lobby from the given id
	 *
	 * @param lobbyId the id of the multiplayer lobby to get
	 */
	getMultiplayerLobby(lobbyId: number): Lobby {
		for (const lobby in this.allLobbies) {
			if (this.allLobbies[lobby].lobbyId == lobbyId) {
				return this.allLobbies[lobby];
			}
		}

		return null;
	}

	/**
	 * Get a multiplayer lobby by an irc channel
	 *
	 * @param name the name of the irc channel
	 */
	getMultiplayerLobbyByIrc(name: string): Lobby {
		for (const lobby in this.allLobbies) {
			if (`#mp_${Lobby.getMultiplayerIdFromLink(this.allLobbies[lobby].multiplayerLink)}` == name) {
				return this.allLobbies[lobby];
			}
		}
	}

	/**
	 * Update a multiplayer lobby
	 *
	 * @param multiplayerLobby the multiplayer lobby to update
	 */
	updateMultiplayerLobby(multiplayerLobby: Lobby): void {
		for (const lobby in this.allLobbies) {
			if (this.allLobbies[lobby].lobbyId == multiplayerLobby.lobbyId) {
				this.allLobbies[lobby] = Lobby.makeTrueCopy(multiplayerLobby);

				this.storeService.set(`lobby.${multiplayerLobby.lobbyId}`, multiplayerLobby);
				return;
			}
		}
	}

	/**
	 * Delete a multiplayer lobby
	 *
	 * @param multiplayerLobby the multiplayer lobby to delete
	 */
	deleteMultiplayerLobby(multiplayerLobby: Lobby): void {
		this.allLobbies.splice(this.allLobbies.indexOf(multiplayerLobby), 1);

		this.storeService.delete(`lobby.${multiplayerLobby.lobbyId}`);
	}

	/**
	 * Check if the synchronization has been completed
	 */
	synchronizeIsCompleted(): Observable<Lobby> {
		return this.synchronizeDone$.asObservable();
	}

	/**
	 * Synchronize the multiplayer lobby
	 *
	 * @param multiplayerLobby the multiplayer lobby to synchronize
	 * @param showToast whether or not to show toast messages
	 * @param sendWebhook whether or not to send the result to the webhook
	 */
	synchronizeMultiplayerMatch(multiplayerLobby: Lobby, showToast?: boolean, sendWebhook?: boolean): void {
		this.multiplayerService.get(multiplayerLobby.multiplayerLink).subscribe((multiplayerMatch: MultiplayerMatch) => {
			multiplayerLobby.teamOneScore = 0;
			multiplayerLobby.teamTwoScore = 0;

			for (const currentGame of multiplayerMatch.games) {
				const multiplayerData = new MultiplayerData({
					game_id: currentGame.game_id,
					beatmap_id: currentGame.beatmap_id,
					mods: currentGame.mods
				});

				let modifier: number;

				// Get the tournament if it wasn't initialized yet
				if (multiplayerLobby.tournament == null) {
					multiplayerLobby.tournament = this.tournamentService.getTournamentById(multiplayerLobby.tournamentId);
				}

				// Set the modifier if AxS score interface is being used
				if (multiplayerLobby.tournament.scoreInterface instanceof AxSCalculation) {
					modifier = multiplayerLobby.tournament.getModifierFromBeatmapId(currentGame.beatmap_id);
				}

				const cachedBeatmap: CacheBeatmap = this.cacheService.getCachedBeatmap(multiplayerData.beatmap_id);

				// Beatmap has not been cached
				if (cachedBeatmap == null) {
					this.beatmapService.getByBeatmapId(multiplayerData.beatmap_id).subscribe(beatmap => {
						this.cacheService.cacheBeatmap(new CacheBeatmap({
							name: `${beatmap.artist} - ${beatmap.title} [${beatmap.version}]`,
							beatmapId: beatmap.beatmap_id,
							beatmapSetId: beatmap.beatmapset_id,
							beatmapUrl: `https://osu.ppy.sh/beatmaps/${beatmap.beatmap_id}`
						}));
					});
				}

				for (const currentScore of currentGame.scores) {
					const cachedUser: CacheUser = this.cacheService.getCachedUser(currentScore.user_id);

					// User has not been cached
					if (cachedUser == null) {
						this.osuUserService.getByUserId(currentScore.user_id).subscribe(user => {
							this.cacheService.cacheUser(new CacheUser({
								user_id: user.user_id,
								username: user.username
							}));
						});
					}

					const newMultiplayerDataUser = new MultiplayerDataUser({
						user: +currentScore.user_id,
						score: +currentScore.score,
						accuracy: Calculations.getAccuracyOfScore(currentScore),
						passed: +currentScore.pass,
						slot: +currentScore.slot,
						mods: +currentScore.enabled_mods,
						team: +currentScore.team
					});

					// Invalidate beatmaps that aren't part of the mappool
					if (multiplayerLobby.mappool != null || multiplayerLobby.mappool != undefined) {
						let beatmapFound = false;

						for (const modBracket of multiplayerLobby.mappool.modBrackets) {
							for (const map of modBracket.beatmaps) {
								if (map.beatmapId == currentGame.beatmap_id) {
									beatmapFound = true;
									break;
								}
							}
						}

						if (beatmapFound == false && multiplayerLobby.tournament.invalidateBeatmaps == true) {
							if (!multiplayerLobby.gamesCountTowardsScore.hasOwnProperty(currentGame.game_id)) {
								multiplayerLobby.gamesCountTowardsScore[currentGame.game_id] = false;
							}
						}
						else {
							if (!multiplayerLobby.gamesCountTowardsScore.hasOwnProperty(currentGame.game_id)) {
								multiplayerLobby.gamesCountTowardsScore[currentGame.game_id] = true;
							}
						}
					}
					// No selected mappool, default to always count towards score
					else {
						if (!multiplayerLobby.gamesCountTowardsScore.hasOwnProperty(currentGame.game_id)) {
							multiplayerLobby.gamesCountTowardsScore[currentGame.game_id] = true;
						}
					}

					multiplayerData.addPlayer(newMultiplayerDataUser);
				}

				const calculate = new Calculate();
				const scoreInterface = calculate.getScoreInterface(multiplayerLobby.tournament.scoreInterfaceIdentifier);
				scoreInterface.addUserScores(multiplayerData.getPlayers());

				if (scoreInterface.getTeamSize() == undefined || scoreInterface.getTeamSize() == null || scoreInterface.getTeamSize() == 0) {
					scoreInterface.setTeamSize(multiplayerLobby.tournament.teamSize);
				}

				// Set the modifier if AxS score interface is being used
				if (scoreInterface instanceof AxSCalculation) {
					scoreInterface.setModifier(modifier);
				}

				// Provide the mod bracket to the interface
				if (scoreInterface instanceof ThreeCwcScoreCalculation || scoreInterface instanceof OMLScoreCalculation) {
					let foundModBracket: WyModBracket;

					for (const mappool of multiplayerLobby.tournament.mappools) {
						for (const modBracket of mappool.modBrackets) {
							for (const beatmap of modBracket.beatmaps) {
								if (beatmap.beatmapId == currentGame.beatmap_id) {
									foundModBracket = modBracket;
									break;
								}
							}
						}
					}

					if (foundModBracket) {
						scoreInterface.setModBracket(foundModBracket);
					}
				}

				multiplayerData.team_one_score = scoreInterface.calculateTeamOneScore();
				multiplayerData.team_two_score = scoreInterface.calculateTeamTwoScore();

				if (multiplayerData.team_one_score > multiplayerData.team_two_score) {
					if (multiplayerLobby.gamesCountTowardsScore.hasOwnProperty(multiplayerData.game_id) && multiplayerLobby.gamesCountTowardsScore[multiplayerData.game_id] == true) {
						multiplayerLobby.teamOneScore++;
					}
				}
				else {
					if (multiplayerLobby.gamesCountTowardsScore.hasOwnProperty(multiplayerData.game_id) && multiplayerLobby.gamesCountTowardsScore[multiplayerData.game_id] == true) {
						multiplayerLobby.teamTwoScore++;
					}
				}

				if (multiplayerLobby.doesMultiplayerDataExist(multiplayerData)) {
					multiplayerLobby.updateMultiplayerData(multiplayerData);
				}
				else {
					multiplayerLobby.addMultiplayerData(multiplayerData);
				}
			}

			this.synchronizeDone$.next(multiplayerLobby);

			this.updateMultiplayerLobby(multiplayerLobby);

			if (showToast != null && showToast == true) {
				this.toastService.addToast('Successfully synchronized the multiplayer lobby.');
			}

			if (sendWebhook != null && sendWebhook == true) {
				const ircCredentials = this.storeService.get('irc');
				this.webhookService.sendMatchFinishedResult(multiplayerLobby, ircCredentials.username);
			}
		});
	}

	/**
	 * Get a map from the given mystery mappool
	 *
	 * @param mappool the mappool to get the mystery map from
	 * @param modBracket the modbracket to get the mystery map from
	 */
	public pickMysteryMap(mappool: WyMappool, modBracket: WyModBracket, lobby: Lobby, refereeName: string) {
		const mysteryMappoolHelper = new WyMysteryMappoolHelper({
			tournamentId: lobby.tournamentId,
			mappoolId: mappool.publishId,
			modBracketId: modBracket.id,
			multiplayerLobbyName: `[${lobby.tournament.acronym}: (${lobby.teamOneName}) vs (${lobby.teamTwoName})](${lobby.multiplayerLink})`,
			refereeName: refereeName,
			pickedCategories: lobby.pickedCategories
		});

		return this.http.post<WyMysteryMappoolHelper>(`${AppConfig.apiUrl}wyreferee/mystery-mappool`, mysteryMappoolHelper);
	}
}
