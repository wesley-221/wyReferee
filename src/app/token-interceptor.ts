import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, delay, retryWhen } from 'rxjs/operators';
import { AppConfig } from 'environments/environment';
import { OauthService } from './services/oauth.service';
import { Oauth } from './models/authentication/oauth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private isRefreshing = false;
	private OSU_OAUTH_EXPIRED_MESSAGE = 'Your osu! oauth token has expired.';

	constructor(private oauthService: OauthService, private http: HttpClient) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Only use this interceptor for the wyBin api
		if (!req.url.startsWith(AppConfig.apiUrl)) {
			return next.handle(req);
		}

		let accessToken: string;
		let refreshToken: string;

		let osuOauth: Oauth;

		if (this.oauthService.oauth) {
			accessToken = this.oauthService.oauth.access_token;
			refreshToken = this.oauthService.oauth.refresh_token;
		}

		if (this.oauthService.osuOauth) {
			osuOauth = this.oauthService.osuOauth;

			req = req.clone({
				setHeaders: {
					OSU_ACCESS_TOKEN: osuOauth.access_token
				}, withCredentials: true
			});

			req = req.clone({
				setHeaders: {
					OSU_REFRESH_TOKEN: osuOauth.refresh_token
				}
			});
		}

		if (accessToken) {
			req = req.clone({
				setHeaders: {
					Authorization: `${accessToken}`
				}, withCredentials: true
			});
		}

		return next.handle(req).pipe(
			retryWhen(errors => errors
				.pipe(
					concatMap((error, count) => {
						if (count < 2 && error.status == 401) {
							if (error.error.message == this.OSU_OAUTH_EXPIRED_MESSAGE) {
								osuOauth.wyReferee = true;

								this.http.post(`${AppConfig.apiUrl}osu/refresh-token`, osuOauth).subscribe((oauth: Oauth) => {
									this.oauthService.cacheOsuOauth(oauth);
									this.oauthService.osuOauth = oauth;

									this.oauthService.setOsuOauthHasBeenLoaded(true);
								});
							}
							else {
								if (!this.isRefreshing) {
									if (refreshToken !== '') {
										this.http.post(`${AppConfig.apiUrl}refresh-token`, refreshToken).subscribe((oauth: Oauth) => {
											this.oauthService.cacheOauth(oauth);
											this.oauthService.oauth = oauth;

											this.oauthService.setOauthHasBeenLoaded(true);

											this.isRefreshing = false;
										});
									}
								}
							}

							return of(error.status);
						}

						return throwError(error);
					}),
					delay(1500)
				))
		);
	}
}
