import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../models/authentication/register-request';
import { AppConfig } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggedInUser } from '../models/authentication/logged-in-user';
import { StoreService } from './store.service';
import { User } from 'app/models/authentication/user';
import { OauthService } from './oauth.service';
import { ToastService } from './toast.service';

@Injectable({
	providedIn: 'root'
})

export class AuthenticateService {
	private readonly apiUrl = AppConfig.apiUrl;
	public loggedInUser: LoggedInUser;
	public loggedIn = false;

	private loggedInUserLoaded$: BehaviorSubject<Boolean>;

	constructor(private httpClient: HttpClient, private storeService: StoreService, private oauthService: OauthService, private toastService: ToastService) {
		this.loggedInUserLoaded$ = new BehaviorSubject(false);

		this.oauthService.hasOauthBeenLoaded().subscribe((hasLoaded: boolean) => {
			if (hasLoaded == true) {
				this.me().subscribe((user: LoggedInUser) => {
					this.loggedInUser = LoggedInUser.mapFromJson(user);
					this.loggedIn = true;

					this.loggedInUserLoaded$.next(true);

					this.toastService.addToast(`Successfully logged in, welcome ${this.loggedInUser.username}!`);
				});
			}
		})
	}

	/**
	 * Get the userdata of the currently logged in user
	 */
	public me(): Observable<LoggedInUser> {
		return this.httpClient.get<LoggedInUser>(`${this.apiUrl}me`);
	}

	/**
	 * Register a new user
	 * @param registerRequest
	 */
	public register(registerRequest: RegisterRequest): Observable<User> {
		return this.httpClient.post<User>(`${this.apiUrl}register`, registerRequest);
	}

	/**
	 * Login with the given email and password
	 * @param email the email to login with
	 * @param password the password to login with
	 */
	public login(registerRequest: RegisterRequest): Observable<any> {
		return this.httpClient.post<RegisterRequest>(`${this.apiUrl}login`, registerRequest);
	}

	/**
	 * Get all the users
	 */
	public getAllUser(): Observable<any> {
		return this.httpClient.get(`${this.apiUrl}users/list`);
	}

	/**
	 * Check if the logged in user has loaded
	 */
	public hasLoggedInUserLoaded(): Observable<Boolean> {
		return this.loggedInUserLoaded$;
	}

	/**
	 * Set logged in user as loaded or not loaded
	 * @param loaded
	 */
	public setLoggedInUserLoaded(loaded: boolean): void {
		this.loggedInUserLoaded$.next(loaded);
	}

	/**
	 * Logout the current loggedin user
	 */
	public logout() {
		this.loggedIn = false;
		this.loggedInUser = null;

		this.storeService.delete('oauth');
	}
}
