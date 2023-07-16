import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'environments/environment';

@Injectable({
	providedIn: 'root'
})
export class WybinService {
	private readonly API_URL = AppConfig.apiUrl;

	constructor(private http: HttpClient) { }

	importStages(tournamentId: number) {
		return this.http.get(`${this.API_URL}tournament-stages/${tournamentId}`);
	}
}
