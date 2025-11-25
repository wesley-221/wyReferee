import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'app/models/authentication/user';

@Injectable({
	providedIn: 'root'
})

export class AuthenticateService {
	public loggedInUser: User;
	public loggedIn = false;

	private readonly apiUrl = AppConfig.apiUrl;
	private oauthResponse$: BehaviorSubject<string>;

	private userLoggedIn$: BehaviorSubject<boolean>;

	constructor(private httpClient: HttpClient) {
		this.oauthResponse$ = new BehaviorSubject(null);
		this.userLoggedIn$ = new BehaviorSubject(null);
	}

	public loginUser(user: User): void {
		this.loggedInUser = User.makeTrueCopy(user);
		this.loggedIn = true;

		this.userLoggedIn$.next(true);
	}

	/**
	 * Get the osu oauth from the given token
	 * @param token the oauth code from the user
	 */
	public handleOauth(token: string): Observable<User> {
		return this.httpClient.post<User>(`${this.apiUrl}user/authenticate`, {
			token: token,
			issuer: 'wyreferee'
		});
	}

	/**
	 * Logout the current loggedin user
	 */
	public logout(): void {
		this.httpClient.get(`${this.apiUrl}user/logout`).subscribe(() => {
			this.loggedIn = false;
			this.loggedInUser = null;
		});
	}

	/**
	 * Get the data from the authenticated user
	 */
	public getMeData(): Observable<User> {
		return this.httpClient.get<User>(`${this.apiUrl}me`);
	}

	/**
	 * Get all the users
	 */
	public getAllUser(): Observable<any> {
		return this.httpClient.get(`${this.apiUrl}users`);
	}

	/**
	 * Get the oauth token for osu
	 *
	 * @returns observable that contains the oauth token
	 */
	public startOsuOauthProcess(): Observable<string> {
		this.startExpressServer();

		return this.oauthResponse$;
	}

	/**
	 * Triggers when the user logs after authenticating
	 */
	public userLoggedIn() {
		return this.userLoggedIn$.asObservable();
	}

	/**
	 * Start the express server and listen for events from the main process
	 */
	private startExpressServer(): void {
		window.electronApi.server.startExpressServer(this.getOsuOauthUrl());

		window.electronApi.server.onOsuOauthCode((code: string) => {
			this.oauthResponse$.next(code);
		});
	}

	/**
	 * Get the authorization url of the mappicker app
	 *
	 * @returns authorization url of the mappicker app
	 */
	private getOsuOauthUrl(): string {
		const parameters = [
			{ parameterName: 'client_id', value: AppConfig.osu.client_id },
			{ parameterName: 'redirect_uri', value: AppConfig.osu.redirect_uri },
			{ parameterName: 'response_type', value: 'code' },
			{ parameterName: 'scope', value: 'identify%20public' }
		];

		let finalLink = 'https://osu.ppy.sh/oauth/authorize?';

		if (parameters != null) {
			parameters.forEach(parameter => {
				finalLink += `${parameter.parameterName}=${parameter.value}&`;
			});

			finalLink = finalLink.substring(0, finalLink.length - 1);
		}

		return finalLink;
	}
}
