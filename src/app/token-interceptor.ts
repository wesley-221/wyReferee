import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfig } from 'environments/environment';
import { OauthService } from './services/oauth.service';
import { Oauth } from './models/authentication/oauth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private isRefreshing = false;

	constructor(private oauthService: OauthService, private http: HttpClient) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Only use this interceptor for the wyBin api
		if (!req.url.startsWith(AppConfig.apiUrl)) {
			return next.handle(req);
		}

		let accessToken: string;
		let refreshToken: string;

		if (this.oauthService.oauth) {
			accessToken = this.oauthService.oauth.access_token;
			refreshToken = this.oauthService.oauth.refresh_token;
		}

		if (accessToken) {
			req = req.clone({ setHeaders: { Authorization: `${accessToken}` }, withCredentials: true });
		}

		return next.handle(req).pipe(catchError((error: HttpErrorResponse): Observable<any> => {
			// Access token expired, request new access token
			if (error.status === 401) {
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

				return of(error.error.message);
			}

			return throwError(error);
		}));
	}
}
