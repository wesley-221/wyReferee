import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ChallongeService {
	private readonly apiUrl = 'https://api.challonge.com/v1/'

	constructor(private httpClient: HttpClient) { }

	/**
	 * Send a generic request to api to check if the key is correct
	 * @param apiKey
	 */
	public validateApiKey(apiKey: string) {
		return this.httpClient.get(`${this.apiUrl}tournaments.json?api_key=${apiKey}`);
	}

	/**
	 * Get all tournaments
	 * @param apiKey
	 */
	public getAllTournaments(apiKey: string) {
		return this.httpClient.get(`${this.apiUrl}tournaments.json?api_key=${apiKey}`);
	}
}
