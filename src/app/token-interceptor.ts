import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './services/toast.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastType } from './models/toast';
import { AppConfig } from 'environments/environment';
import { OauthService } from './services/oauth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private oauthService: OauthService, private toastService: ToastService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Only use this interceptor for the wyBin api
		if (!req.url.startsWith(AppConfig.apiUrl)) {
			return next.handle(req);
		}

		let token: string;

		if (this.oauthService.oauth) {
			token = this.oauthService.oauth.access_token;
		}

		if (token) {
			req = req.clone({ setHeaders: { Authorization: `${token}` }, withCredentials: true });
		}

		return next.handle(req).pipe(catchError((error: HttpErrorResponse): Observable<any> => {
			// Show the generic known errors, have to figure out the other errors over time
			if (error.status === 401 || error.status === 403) {
				this.toastService.addToast(error.error.message, ToastType.Error);

				return of(error.error.message);
			}

			return throwError(error);
		}));
	}
}
