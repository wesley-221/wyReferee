import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from 'environments/environment';

@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {
	constructor() { }

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		if (!request.url.startsWith(AppConfig.apiUrl)) {
			return next.handle(request);
		}

		request = request.clone({
			withCredentials: true
		});

		return next.handle(request);
	}
}
