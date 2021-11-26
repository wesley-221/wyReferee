import { Injectable } from '@angular/core';
import { Oauth } from 'app/models/authentication/oauth';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreService } from './store.service';

@Injectable({
	providedIn: 'root'
})
export class OauthService {
	public static readonly oauthName = 'oauth';
	public static readonly osuOauthName = 'osu-oauth';

	public oauth: Oauth;
	public osuOauth: Oauth;

	private oauthLoaded$: BehaviorSubject<boolean>;
	private osuOauthLoaded$: BehaviorSubject<boolean>;

	constructor(private storeService: StoreService) {
		this.oauthLoaded$ = new BehaviorSubject(false);
		this.osuOauthLoaded$ = new BehaviorSubject(false);

		const oauthCredentials: Oauth = storeService.get(OauthService.oauthName);
		const osuOauthCredentials: Oauth = storeService.get(OauthService.osuOauthName);

		if (oauthCredentials != undefined) {
			this.oauth = oauthCredentials;

			this.oauthLoaded$.next(true);
		}

		if (osuOauthCredentials != undefined) {
			this.osuOauth = osuOauthCredentials;

			this.osuOauthLoaded$.next(true);
		}
	}

	/**
	 * Cache the oauth data from the user
	 * @param oauth the oauth data
	 */
	public cacheOauth(oauth: Oauth) {
		this.storeService.set(OauthService.oauthName, oauth);
	}

	/**
	 * Cache the osu oauth data from the user
	 * @param oauth the oauth data
	 */
	public cacheOsuOauth(oauth: Oauth) {
		this.storeService.set(OauthService.osuOauthName, oauth);
		this.osuOauth = oauth;
	}

	/**
	 * Check if oauth has been loaded from memory or from login request
	 */
	public hasOauthBeenLoaded(): Observable<boolean> {
		return this.oauthLoaded$;
	}

	/**
	 * Check if osu oauth has been loaded
	 */
	public hasOsuOauthBeenLoaded(): Observable<boolean> {
		return this.osuOauthLoaded$;
	}

	/**
	 * Set oauth as loaded or not loaded
	 * @param loaded
	 */
	public setOauthHasBeenLoaded(loaded: boolean): void {
		this.oauthLoaded$.next(loaded);
	}

	/**
	 * Set osu oauth as loaded or not loaded
	 * @param loaded
	 */
	public setOsuOauthHasBeenLoaded(loaded: boolean): void {
		this.osuOauthLoaded$.next(loaded);
	}
}
