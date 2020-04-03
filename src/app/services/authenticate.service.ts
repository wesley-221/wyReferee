import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../models/authentication/register-request';
import { AppConfig } from '../../environments/environment';
import { Observable } from 'rxjs';
import { LoggedInUser } from '../models/authentication/logged-in-user';
import { StoreService } from './store.service';

@Injectable({
  	providedIn: 'root'
})

export class AuthenticateService {
	private readonly apiUrl = AppConfig.apiUrl;
	public loggedInUser: LoggedInUser;
	public loggedIn: boolean = false;

  	constructor(private httpClient: HttpClient, private storeService: StoreService) {
		const userCredentials = storeService.get('auth');

		if(userCredentials != undefined) {
			this.loggedInUser = LoggedInUser.mapFromJson(storeService.get('auth'));
			this.loggedIn = true;
		}
	}

	/**
	 * Register a new user
	 * @param registerRequest
	 */
	public register(registerRequest: RegisterRequest): Observable<any> {
		return this.httpClient.post<RegisterRequest>(`${this.apiUrl}register`, registerRequest);
	}

	/**
	 * Login with the given email and password
	 * @param email the email to login with
	 * @param password the password to login with
	 */
	public login(registerRequest: RegisterRequest): Observable<any> {
		return this.httpClient.post<RegisterRequest>(`${this.apiUrl}login`, registerRequest, { observe: 'response' });
	}

	/**
	 * Logout the current loggedin user
	 */
	public logout() {
		this.loggedIn = false;
		this.loggedInUser = null;

		this.storeService.delete(`auth`);
	}

	/**
	 * Cache the data of a user
	 * @param loggedInUser the loggedin user to cache
	 */
	public cacheLoggedInUser(loggedInUser: LoggedInUser) {
		this.storeService.set(`auth`, loggedInUser.convertToJson());
	}
}
