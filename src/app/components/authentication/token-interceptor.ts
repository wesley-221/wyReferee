import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { AuthenticateService } from "../../services/authenticate.service";
import { catchError } from "rxjs/operators";
import { ToastService } from "../../services/toast.service";
import { ToastType } from "../../models/toast";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	// The ips that don't have to be checked by the interceptor
	private ignoreInterceptorFor = [
		"https://osu.ppy.sh"
	];

    constructor(private authService: AuthenticateService, private toastService: ToastService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Check if we can ignore an ip
		for(let ip of this.ignoreInterceptorFor) {
			if(req.url.startsWith(ip)) {
				return next.handle(req);
			}
		}

        let token: string;

        if(this.authService.loggedIn) {
            token = this.authService.loggedInUser.token;
		}

        if(token) {
            req = req.clone({ setHeaders: { Authorization: `${token}` }, withCredentials: true });
        }

        return next.handle(req).pipe(catchError((error: HttpErrorResponse): Observable<any> => {
            // Logout the user if the token has expired
            if(error.status === 403) {
                if(this.authService.loggedInUser != null) {
                    this.authService.logout();
                }
            }

            // Show the generic known errors, have to figure out the other errors over time
            if(error.status === 401 || error.status === 403) {
                this.toastService.addToast(error.error.message, ToastType.Error);

                return of(error.error.message);
            }

            return throwError(error);
        }));
    }
}
