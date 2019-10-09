import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ApiKeyValidation {
	// The best player in osu!
	userId: number = 2407265;

  	constructor(private httpClient: HttpClient) { }

	/**
	 * Validate an api key by making a call to the osu! api
	 * @param apiKey the api key to validate
	 */
	validate(apiKey: number): Observable<User> {
		return this.httpClient.get<User>(`https://osu.ppy.sh/api/get_user?k=${apiKey}&u=${this.userId}&type=id`);
	}
}
