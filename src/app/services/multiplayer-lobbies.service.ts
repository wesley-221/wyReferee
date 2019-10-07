import { Injectable } from '@angular/core';
import { MultiplayerLobby } from '../models/multiplayer-lobby';
import { StoreService } from './store.service';
import { GetMultiplayerService } from './get-multiplayer.service';
import { MultiplayerDataUser } from '../models/multiplayer-data-user';
import { AxsCalculations } from '../models/axs-calculations';
import { MultiplayerData } from '../models/multiplayer-data';
import { ToastService } from './toast.service';

@Injectable({
  	providedIn: 'root'
})

export class MultiplayerLobbiesService {
	private allLobbies: MultiplayerLobby[] = [];
	availableLobbyId: number = 0;
	
  	constructor(private storeService: StoreService, private getMultiplayer: GetMultiplayerService, private toastService: ToastService) {
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

	public synchronizeMultiplayerMatch(multiplayerLobby: MultiplayerLobby): void {
		this.getMultiplayer.get(multiplayerLobby.multiplayerLink).subscribe(data => {
			multiplayerLobby.teamOneScore = 0;
			multiplayerLobby.teamTwoScore = 0;


			for(let game in data.games) {
				const currentGame = data.games[game];
				const multiplayerData = new MultiplayerData();

				const MODIFIER = 0;

				multiplayerData.game_id = currentGame.game_id;
				multiplayerData.beatmap_id = currentGame.beatmap_id;

				for(let score in currentGame.scores) {
					// TODO: cache username of currentGame.scores[score].user_id

					const currentScore = currentGame.scores[score];
					const newMpDataUser = new MultiplayerDataUser();

					// Accuracy players are placed in slot 0 and 3
					if(currentScore.slot == 0 || currentScore.slot == 3) {
						newMpDataUser.user = currentScore.user_id;
						newMpDataUser.score = (currentScore.pass == 0 ? 0 : AxsCalculations.calculateAccuracyPlayerScore(currentScore.score));
						newMpDataUser.accuracy = AxsCalculations.getAccuracyOfScore(currentScore);
						newMpDataUser.passed = currentScore.pass;
						newMpDataUser.slot = currentScore.slot;
					}
					// Score players are placed in slot 1, 2 and 4, 5
					else if(currentScore.slot == 1 || currentScore.slot == 2 || currentScore.slot == 4 || currentScore.slot == 5) {
						newMpDataUser.user = currentScore.user_id;
						
						// TODO: implement modifier
						newMpDataUser.score = (currentScore.pass == 0 ? 0 : AxsCalculations.calculateScorePlayerScore(currentScore.score, AxsCalculations.getAccuracyOfScore(currentScore), MODIFIER));
						newMpDataUser.accuracy = AxsCalculations.getAccuracyOfScore(currentScore);
						newMpDataUser.passed = currentScore.pass;
						newMpDataUser.slot = currentScore.slot;
					}

					if(!multiplayerLobby.mapsCountTowardScore.hasOwnProperty(currentGame.game_id)) {
						multiplayerLobby.mapsCountTowardScore[currentGame.game_id] = true;
					}

					multiplayerData.addPlayer(newMpDataUser);
				}

				// TODO: implement modifier
				multiplayerData.team_one_score = AxsCalculations.calculateTeamScore(multiplayerData.getPlayer(0).score, multiplayerData.getPlayer(1).score, multiplayerData.getPlayer(2).score, multiplayerData.getPlayer(0).accuracy, MODIFIER);
				multiplayerData.team_two_score = AxsCalculations.calculateTeamScore(multiplayerData.getPlayer(3).score, multiplayerData.getPlayer(4).score, multiplayerData.getPlayer(5).score, multiplayerData.getPlayer(3).accuracy, MODIFIER);

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

			this.toastService.addToast('Successfully synchronized the multiplayer lobby.');
		});
	}
}
