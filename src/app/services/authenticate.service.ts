import { Injectable } from '@angular/core';
import { StoreService } from './store.service';

@Injectable({
  	providedIn: 'root'
})

export class AuthenticateService {
	public loggedInUser: string = "Guest";
	public loggedIn: boolean = false;
	public token: string;

  	constructor(private storeService: StoreService) {
		this.token = storeService.get('auth.token');

	}

	/**
	 * Login with the given email and password
	 * @param email the email to login with
	 * @param password the password to login with
	 */
	public login(email: string, password: string): Promise<any> {
		return null;
	}

	/**
	 * Logout the current loggedin user
	 */
	public logout() {
		return null;
	}
}
