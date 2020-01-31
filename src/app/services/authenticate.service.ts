import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../models/authentication/register-request';
import { AppConfig } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  	providedIn: 'root'
})

export class AuthenticateService {
	private readonly apiUrl = AppConfig.apiUrl;
	public loggedInUser: string = "Guest";
	public loggedIn: boolean = false;

  	constructor(private httpClient: HttpClient) { }

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
	public login(email: string, password: string): Promise<any> {
		return null;
	}

	/**
	 * Logout the current loggedin user
	 */
	public logout() {
		return null;
	}
}
