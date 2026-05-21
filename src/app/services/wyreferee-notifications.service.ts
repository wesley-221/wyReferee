import { Injectable } from '@angular/core';
import { AppConfig } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { WyRefereeNotification } from '../models/wyreferee-notification';

@Injectable({
	providedIn: 'root'
})
export class WyRefereeNotificationsService {
	private readonly apiUrl = AppConfig.apiUrl;

	constructor(private http: HttpClient) { }

	getNotifications(version: string) {
		return this.http.get<WyRefereeNotification[]>(`${this.apiUrl}wyreferee-notification?version=${version}`);
	}
}
