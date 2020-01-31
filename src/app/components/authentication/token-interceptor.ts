import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticateService } from "../../services/authenticate.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthenticateService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token;

        if(this.authService.loggedIn) {
            token = this.authService.loggedInUser.token;
        }

        if(token) {
            req = req.clone({ setHeaders: { Authorization: `${token}` }, withCredentials: true });
        }

        return next.handle(req);
    }
}