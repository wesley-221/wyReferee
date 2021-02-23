import { Injectable } from '@angular/core';
import { Oauth } from 'app/models/authentication/oauth';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreService } from './store.service';

@Injectable({
	providedIn: 'root'
})
export class OauthService {
	public static readonly oauthName = 'oauth';

	public oauth: Oauth;
	private oauthLoaded$: BehaviorSubject<Boolean>;

	constructor(private storeService: StoreService) {
		this.oauthLoaded$ = new BehaviorSubject(false);

		const oauthCredentials: Oauth = storeService.get(OauthService.oauthName);

		if (oauthCredentials != undefined) {
			this.oauth = oauthCredentials;

			this.oauthLoaded$.next(true);
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
	 * Check if oauth has been loaded from memory or from login request
	 */
	public hasOauthBeenLoaded(): Observable<Boolean> {
		return this.oauthLoaded$;
	}

	/**
	 * Set oauth as loaded or not loaded
	 * @param loaded
	 */
	public setOauthHasBeenLoaded(loaded: boolean): void {
		this.oauthLoaded$.next(loaded);
	}
}
