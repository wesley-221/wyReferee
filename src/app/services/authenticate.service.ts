import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'app/models/authentication/user';
import { ElectronService } from './electron.service';

@Injectable({
	providedIn: 'root'
})

export class AuthenticateService {
	public loggedInUser: User;
	public loggedIn = false;

	private readonly apiUrl = AppConfig.apiUrl;
	private oauthResponse$: BehaviorSubject<string>;

	constructor(private httpClient: HttpClient, private electronService: ElectronService) {
		this.oauthResponse$ = new BehaviorSubject(null);
	}

	public loginUser(user: User): void {
		this.loggedInUser = User.makeTrueCopy(user);
		this.loggedIn = true;
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
		this.openOsuBrowserWindow();

		return this.oauthResponse$;
	}

	/**
	 * Open a window for the osu oauth process
	 */
	private openOsuBrowserWindow(): void {
		this.electronService.openLink(this.getOsuOauthUrl());

		this.electronService.ipcRenderer.on('osu-oauth-callback', (_, url) => {
			const oauthToken = url.replace(`${AppConfig.osu.redirect_uri}/?code=`, '');

			this.oauthResponse$.next(oauthToken);
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
