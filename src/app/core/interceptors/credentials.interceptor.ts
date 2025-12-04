import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { AppConfig } from 'environments/environment';

export const credentialsInterceptor: HttpInterceptorFn = (request, next) => {
	if (!request.url.startsWith(AppConfig.apiUrl)) {
		return next(request);
	}

	return from(window.electronApi.authentication.getSession()).pipe(
		switchMap(sessionId => {
			request = request.clone({
				withCredentials: false
			});

			if (sessionId == null) {
				return next(request);
			}

			request = request.clone({
				setHeaders: {
					'Authorization': `Bearer ${sessionId}`
				}
			});

			return next(request);
		})
	);
}
