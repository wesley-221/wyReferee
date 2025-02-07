import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ChallongeService {
	private readonly apiUrl = AppConfig.apiUrl;

	constructor(private http: HttpClient) { }

	/**
	 * Update the match score to Challonge
	 *
	 * @param tournamentId the id of the wyBin tournament
	 * @param wyBinStageId the id of the stage
	 * @param wyBinMatchId the id of the match
	 * @param stageName the name of the stage
	 * @param teamOneName the name of the first team or player
	 * @param teamTwoName the name of the second team or player
	 * @param teamOneScore the score of the first team or player
	 * @param teamTwoScore the score of the second team or player
	 * @param winnerName the name of team or player that is the winner of the match
	 */
	updateMatchScore(tournamentId: number, wyBinStageId: number, wyBinMatchId: number, stageName: string, teamOneName: string, teamTwoName: string, teamOneScore: number, teamTwoScore: number, winnerName: string) {
		return this.http.post(`${this.apiUrl}challonge-match-score`, {
			tournamentId,
			wyBinStageId,
			wyBinMatchId,
			stageName,
			teamOneName,
			teamTwoName,
			teamOneScore,
			teamTwoScore,
			winnerName
		});
	}
}
