import { Observable } from 'rxjs';
import { OsuUser } from '../../models/osu-models/osu-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class ApiKeyValidation {
	// The best player in osu!
	userId = 2407265;

	constructor(private httpClient: HttpClient) { }

	/**
	 * Validate an api key by making a call to the osu! api
	 *
	 * @param apiKey the api key to validate
	 */
	validate(apiKey: string): Observable<OsuUser> {
		return this.httpClient.get<OsuUser>(`https://osu.ppy.sh/api/get_user?k=${apiKey}&u=${this.userId}&type=id`);
	}
}
