import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { AppConfig } from 'environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ChallongeService {
	private readonly challongeApiUrl = 'https://api.challonge.com/v1/';
	private readonly apiUrl = AppConfig.apiUrl;

	constructor(private httpClient: HttpClient) { }

	/**
	 * Send a generic request to api to check if the key is correct
	 * @param apiKey
	 */
	public validateApiKey(apiKey: string) {
		return this.httpClient.get(`${this.challongeApiUrl}tournaments.json?api_key=${apiKey}`);
	}

	/**
	 * Get all tournaments
	 * @param apiKey
	 */
	public getAllTournaments(apiKey: string) {
		return this.httpClient.get(`${this.challongeApiUrl}tournaments.json?api_key=${apiKey}`);
	}

	/**
	 * Endpoint to check if the tournament has challonge integration
	 * @param tournament the tournament to check
	 */
	public getChallongeMatchups(tournament: WyTournament) {
		return this.httpClient.post(`${this.apiUrl}challonge-matchups`, tournament.publishId);
	}

	/**
	 * Parse challonge endpoint from wyBin
	 * @param challongeResult
	 */
	public parseChallongeEndpoint(challongeResult: any): ChallongeMatch[] {
		let allMatches: ChallongeMatch[] = [];
		let allParticipants = {};

		const parsedMatches = JSON.parse(challongeResult.matches);
		const parsedParticipants = JSON.parse(challongeResult.participants);

		for (const iterationParticipant of parsedParticipants) {
			const participant: ChallongeParticipant = iterationParticipant.participant;
			allParticipants[participant.id] = participant;
		}

		for (const iterationMatch of parsedMatches) {
			const match: ChallongeMatch = iterationMatch.match;

			for (const participant of Object.keys(allParticipants)) {
				if ((match as any).player1_id == allParticipants[participant].id) {
					match.player1 = allParticipants[participant];
				}

				if ((match as any).player2_id == allParticipants[participant].id) {
					match.player2 = allParticipants[participant];
				}
			}

			allMatches.push(match);
		}

		for (const match of allMatches) {
			for (const preReqMatch of allMatches) {
				if (preReqMatch.id == match.player1_prereq_match_id && match.player1_prereq_match_id != null) {
					match.player1_prereq_match = preReqMatch;
				}

				if (preReqMatch.id == match.player2_prereq_match_id && match.player2_prereq_match_id != null) {
					match.player2_prereq_match = preReqMatch;
				}
			}
		}

		for (const match of allMatches) {
			match.getPlayer1Name = () => {
				return match.player1 != undefined ?
					match.player1.name :
					match.player1_prereq_match != null ? `Winner of match ${match.player1_prereq_match.suggested_play_order}` : 'Unknown';
			}

			match.getPlayer2Name = () => {
				return match.player2 != undefined ?
					match.player2.name :
					match.player2_prereq_match != null ? `Winner of match ${match.player2_prereq_match.suggested_play_order}` : 'Unknown';
			}

			match.getScore = () => {
				return match.scores_csv == '' ? '0-0' : match.scores_csv;
			}
		}

		return allMatches;
	}

	/**
	 * Update the score on challonge
	 * @param tournamentId the id of the published tournament
	 * @param challongeTournamentId the id of the tournament to update
	 * @param challongeMatchId the id of the match to update
	 * @param scorePlayer1 the score of the first player/team
	 * @param scorePlayer2 the score of the first player/team
	 * @param winner the id of the winner if there is a winner
	 */
	public updateChallonge(tournamentId: number, challongeTournamentId: number, challongeMatchId: number, scorePlayer1: number, scorePlayer2: number, winner: number = null) {
		return this.httpClient.post(`${this.apiUrl}challonge-update`, {
			tournamentId: tournamentId,
			challongeTournamentId: challongeTournamentId,
			challongeMatchId: challongeMatchId,
			scorePlayer1: scorePlayer1,
			scorePlayer2: scorePlayer2,
			winner: winner
		});
	}

	/**
	 * Endpoint to create a tournament through Challonge
	 * @param apiKey the api key for Challonge
	 * @param name the name of the tournament
	 * @param url the url of the tournament
	 * @param type the type of the tournament
	 */
	public createTournament(apiKey: string, name: string, url: string, type: string) {
		return this.httpClient.post(`${this.apiUrl}challonge-create`, {
			apiKey: apiKey,
			tournamentName: name,
			tournamentUrl: url,
			tournamentTournamentType: type
		});
	}

	/**
	 * Bulk add all given participants to the tournament
	 * @param tournament the tournament to add the participants to
	 * @param participants the participants to add to the tournament
	 */
	public bulkAddParticipants(tournament: number, participants: string[], apiKey: string) {
		return this.httpClient.post(`${this.apiUrl}challonge-bulk-add`, {
			tournament: tournament,
			participants: participants,
			apiKey: apiKey
		});
	}
}
