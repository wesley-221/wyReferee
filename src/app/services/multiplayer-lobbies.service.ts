import { Injectable } from '@angular/core';
import { MultiplayerLobby } from '../models/store-multiplayer/multiplayer-lobby';
import { StoreService } from './store.service';
import { GetMultiplayerService } from './osu-api/get-multiplayer.service';
import { MultiplayerDataUser } from '../models/store-multiplayer/multiplayer-data-user';
import { AxsCalculations } from '../models/axs-calculations';
import { MultiplayerData } from '../models/store-multiplayer/multiplayer-data';
import { ToastService } from './toast.service';
import { CacheService } from './cache.service';
import { CacheUser } from '../models/cache/cache-user';
import { GetUser } from './osu-api/get-user.service';
import { CacheBeatmap } from '../models/cache/cache-beatmap';
import { GetBeatmap } from './osu-api/get-beatmap.service';
import { MappoolService } from './mappool.service';
import { Calculate } from '../models/score-calculation/calculate';

@Injectable({
  	providedIn: 'root'
})

export class MultiplayerLobbiesService {
	private allLobbies: MultiplayerLobby[] = [];
	availableLobbyId: number = 0;
	
  	constructor(
		  private storeService: StoreService, 
		  private getMultiplayer: GetMultiplayerService, 
		  private toastService: ToastService, 
		  private cacheService: CacheService,
		  private getUser: GetUser,
		  private getBeatmap: GetBeatmap, 
		  private mappoolService: MappoolService) {
		const allLobbies = storeService.get('lobby');

		for(let lobby in allLobbies) {
			const currentLobby = allLobbies[lobby];

			const newLobby = new MultiplayerLobby();
			newLobby.loadFromJson(currentLobby);
			this.allLobbies.push(newLobby);

			this.availableLobbyId = newLobby.lobbyId + 1;
		}
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
		this.availableLobbyId ++;

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
		for(let lobby in this.allLobbies) {
			if(this.allLobbies[lobby].lobbyId == lobbyId) {
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
		for(let lobby in this.allLobbies) {
			if(`#mp_${this.getMultiplayerIdFromLink(this.allLobbies[lobby].multiplayerLink)}` == name) {
				return this.allLobbies[lobby];
			}
		}
	}

	/**
	 * Update the multiplayerlobby
	 * @param multiplayerLobby the multiplayerlobby to update
	 */
	public update(multiplayerLobby: MultiplayerLobby): void {
		for(let lobby in this.allLobbies) {
			if(this.allLobbies[lobby].lobbyId == multiplayerLobby.lobbyId) {
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

			for(let game in data.games) {
				const currentGame = data.games[game];
				const multiplayerData = new MultiplayerData();

				let MODIFIER = 0;

				// Get the mappool if it wasn't set yet
				if(multiplayerLobby.mappool == null) {
					multiplayerLobby.mappool = this.mappoolService.getMappool(multiplayerLobby.mappoolId);
				}

				// Check if there is a mappool selected and if the modifier exists for the beatmap
				if(multiplayerLobby.mappool != null && multiplayerLobby.mappool.modifiers.hasOwnProperty(currentGame.beatmap_id)) {
					MODIFIER = multiplayerLobby.mappool.modifiers[currentGame.beatmap_id].modifier;	
				}

				multiplayerData.game_id = currentGame.game_id;
				multiplayerData.beatmap_id = currentGame.beatmap_id;

				const cachedBeatmap: CacheBeatmap = this.cacheService.getCachedBeatmap(multiplayerData.beatmap_id);

				// Check if the beatmap is cached
				if(cachedBeatmap == null) {
					this.getBeatmap.getByBeatmapId(multiplayerData.beatmap_id).subscribe(data => {
						this.cacheService.cacheBeatmap(new CacheBeatmap(`${data.artist} - ${data.title} [${data.version}]`, data.beatmap_id, data.beatmapset_id));
					});
				}

				// Loop through all the scores
				for(let score in currentGame.scores) {
					const cachedUser: CacheUser = this.cacheService.getCachedUser(currentGame.scores[score].user_id);

					// Check if the user is cached
					if(cachedUser == null) {
						this.getUser.getByUserId(currentGame.scores[score].user_id).subscribe(data => {
							this.cacheService.cacheUser(data);
						});
					}

					const 	currentScore = currentGame.scores[score],
							newMpDataUser = new MultiplayerDataUser();

					newMpDataUser.user = currentScore.user_id;
					newMpDataUser.score = currentScore.score;
					newMpDataUser.accuracy = AxsCalculations.getAccuracyOfScore(currentScore);
					newMpDataUser.passed = currentScore.pass;
					newMpDataUser.slot = currentScore.slot;


					// Accuracy players are placed in slot 0 and 3
					// if(currentScore.slot == 0 || currentScore.slot == 3) {
					// 	newMpDataUser.user = currentScore.user_id;
					// 	newMpDataUser.score = (currentScore.pass == 0 ? 0 : AxsCalculations.calculateAccuracyPlayerScore(currentScore.score));
					// 	newMpDataUser.accuracy = AxsCalculations.getAccuracyOfScore(currentScore);
					// 	newMpDataUser.passed = currentScore.pass;
					// 	newMpDataUser.slot = currentScore.slot;
					// }
					// // Score players are placed in slot 1, 2 and 4, 5
					// else if(currentScore.slot == 1 || currentScore.slot == 2 || currentScore.slot == 4 || currentScore.slot == 5) {
					// 	newMpDataUser.user = currentScore.user_id;
						
					// 	newMpDataUser.score = (currentScore.pass == 0 ? 0 : AxsCalculations.calculateScorePlayerScore(currentScore.score, AxsCalculations.getAccuracyOfScore(currentScore), MODIFIER));
					// 	newMpDataUser.accuracy = AxsCalculations.getAccuracyOfScore(currentScore);
					// 	newMpDataUser.passed = currentScore.pass;
					// 	newMpDataUser.slot = currentScore.slot;
					// }

					if(!multiplayerLobby.mapsCountTowardScore.hasOwnProperty(currentGame.game_id)) {
						multiplayerLobby.mapsCountTowardScore[currentGame.game_id] = true;
					}

					multiplayerData.addPlayer(newMpDataUser);
				}

				// const 	playerOne = multiplayerData.getPlayer(0), 
				// 		playerTwo = multiplayerData.getPlayer(1),
				// 		playerThree = multiplayerData.getPlayer(2),
				// 		playerFour = multiplayerData.getPlayer(3),
				// 		playerFive = multiplayerData.getPlayer(4),
				// 		playerSix = multiplayerData.getPlayer(5);

				// const playerOneData = {
				// 	score: playerOne == null ? 0 : playerOne.score, 
				// 	accuracy : playerOne == null ? 0 : playerOne.accuracy
				// }, playerTwoData = {
				// 	score: playerTwo == null ? 0 : playerTwo.score, 
				// 	accuracy : playerTwo == null ? 0 : playerTwo.accuracy
				// }, playerThreeData = {
				// 	score: playerThree == null ? 0 : playerThree.score, 
				// 	accuracy : playerThree == null ? 0 : playerThree.accuracy
				// }, playerFourData = {
				// 	score: playerFour == null ? 0 : playerFour.score, 
				// 	accuracy : playerFour == null ? 0 : playerFour.accuracy
				// }, playerFiveData = {
				// 	score: playerFive == null ? 0 : playerFive.score, 
				// 	accuracy : playerFive == null ? 0 : playerFive.accuracy
				// }, playerSixData = {
				// 	score: playerSix == null ? 0 : playerSix.score, 
				// 	accuracy : playerSix == null ? 0 : playerSix.accuracy
				// };

				// multiplayerData.team_one_score = AxsCalculations.calculateTeamScore(playerOneData.score, playerTwoData.score, playerThreeData.score, playerThree.accuracy, MODIFIER);
				// multiplayerData.team_two_score = AxsCalculations.calculateTeamScore(playerFourData.score, playerFiveData.score, playerSixData.score, playerFourData.accuracy, MODIFIER);

				const calculate = new Calculate();
				const scoreInterface = calculate.getScoreInterface('Team vs.');

				scoreInterface.setTeamSize(multiplayerLobby.teamSize);
				scoreInterface.addUsers(multiplayerData.getPlayers());

				multiplayerData.team_one_score = scoreInterface.calculateTeamOneScore();
				multiplayerData.team_two_score = scoreInterface.calculateTeamTwoScore();

				// Add team score if it counts towards the score
				if(multiplayerData.team_one_score > multiplayerData.team_two_score) {
					if(multiplayerLobby.mapsCountTowardScore.hasOwnProperty(multiplayerData.game_id) && multiplayerLobby.mapsCountTowardScore[multiplayerData.game_id] == true) {
						multiplayerLobby.teamOneScore ++;
					}
				}
				else {
					if(multiplayerLobby.mapsCountTowardScore.hasOwnProperty(multiplayerData.game_id) && multiplayerLobby.mapsCountTowardScore[multiplayerData.game_id] == true) {
						multiplayerLobby.teamTwoScore ++;
					}
				}

				if(multiplayerLobby.existMpData(multiplayerData)) {
					multiplayerLobby.updateMpData(multiplayerData);
				}
				else {
					multiplayerLobby.addMpData(multiplayerData);
				}
			}

			// Save multiplayerLobby
			this.update(multiplayerLobby);

			if(showToasts) 
				this.toastService.addToast('Successfully synchronized the multiplayer lobby.');
		});
	}

	/**
	 * Get the id of the multiplayer link
	 * @param link the multiplayerlink
	 */
	private getMultiplayerIdFromLink(link: string) {
		const regularExpression = new RegExp(/https:\/\/osu\.ppy\.sh\/community\/matches\/([0-9]+)/).exec(link);

        if(regularExpression) {
            return regularExpression[1];
        }

        return null;
	}
}
