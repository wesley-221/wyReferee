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
import { ElectronService } from './electron.service';
import { Oauth } from 'app/models/authentication/oauth';

@Injectable({
	providedIn: 'root'
})

export class AuthenticateService {
	private readonly apiUrl = AppConfig.apiUrl;
	public loggedInUser: User;
	public loggedIn = false;

	private loggedInUserLoaded$: BehaviorSubject<Boolean>;
	private oauthResponse$: BehaviorSubject<Oauth>;

	constructor(private httpClient: HttpClient, private storeService: StoreService, private oauthService: OauthService, private toastService: ToastService, private electronService: ElectronService) {
		this.loggedInUserLoaded$ = new BehaviorSubject(false);
		this.oauthResponse$ = new BehaviorSubject(null);

		this.oauthService.hasOsuOauthBeenLoaded().subscribe(hasLoaded => {
			if (hasLoaded == true) {
				this.getMeData(false).subscribe(user => {
					this.loggedInUser = User.makeTrueCopy(user.user);
					this.loggedIn = true;

					this.loggedInUserLoaded$.next(true);

					this.toastService.addToast(`Successfully logged in, welcome ${this.loggedInUser.username}!`);
				});
			}
		});
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
		return this.httpClient.get(`${this.apiUrl}users`);
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

	/**
	 * Get the authorization url of the mappicker app
	 * @returns authorization url of the mappicker app
	 */
	private getOsuOauthUrl(): string {
		const parameters = [
			{ parameterName: 'client_id', value: AppConfig.osu.client_id },
			{ parameterName: 'redirect_uri', value: AppConfig.osu.redirect_uri },
			{ parameterName: 'response_type', value: 'code' },
			{ parameterName: 'scope', value: 'identify%20public' }
		];

		let finalLink = 'https://osu.ppy.sh/oauth/authorize?'

		if (parameters != null) {
			parameters.forEach(parameter => {
				finalLink += `${parameter.parameterName}=${parameter.value}&`
			});

			finalLink = finalLink.substring(0, finalLink.length - 1);
		}

		return finalLink;
	}

	/**
	 * Open a window for the osu oauth process
	 */
	private openOsuBrowserWindow(): void {
		const oldWindow = this.electronService.remote.getCurrentWindow();

		const win = new this.electronService.remote.BrowserWindow({
			icon: `src/assets/images/icon.png`,
			modal: true,
			parent: oldWindow
		});

		win.loadURL(this.getOsuOauthUrl());

		const contents = win.webContents
		contents.on('will-redirect', (_, url) => {
			const oauthToken = url.replace(`${AppConfig.osu.redirect_uri}?code=`, '');

			win.close();

			this.httpClient.post<Oauth>(`${AppConfig.apiUrl}request-osu-oauth-token`, oauthToken).subscribe(response => {
				this.oauthResponse$.next(response);
				oldWindow.reload();
			}, (err) => {
				console.log(err);
				oldWindow.reload();
			});
		});
	}

	/**
	 * Get the oauth token for osu
	 * @returns observable that contains the oauth token
	 */
	public startOsuOauthProcess(): Observable<Oauth> {
		this.openOsuBrowserWindow();

		return this.oauthResponse$;
	}

	/**
	 * Get the public osu data of the current logged in user
	 */
	public getMeData(withOauth?: boolean): Observable<any> {
		if(withOauth && withOauth == true) {
			return this.httpClient.get<any>(`${AppConfig.apiUrl}osu/me/oauth`);
		}
		else {
			return this.httpClient.get<any>(`${AppConfig.apiUrl}osu/me`);
		}
	}
}
