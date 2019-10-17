import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
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

		firebase.auth().onAuthStateChanged(user => {
			// Valid user found
			if(user) {
				this.loggedInUser = user.email;
				this.loggedIn = true;
			}
			// No valid user found
			else {
				this.loggedInUser = "Guest";
				this.loggedIn = false;
				this.token = "";
			}
		});
	}

	/**
	 * Login with the given email and password
	 * @param email the email to login with
	 * @param password the password to login with
	 */
	public login(email: string, password: string): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			firebase.auth().signInWithEmailAndPassword(email, password).then(response => {
				this.loggedInUser = email;
				this.loggedIn = true;
				firebase.auth().currentUser.getIdToken().then((token: string) => {
					this.token = token;
					this.storeService.set('auth.token', this.token);
				});

				this.storeService.set('auth.user', email);

				resolve(response);
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * Logout the current loggedin user
	 */
	public logout() {
		return new Promise<any>((resolve, reject) => {
			firebase.auth().signOut().then(() => {
				this.storeService.delete('auth');

				resolve();
			}).catch(err => {
				reject(err);
			});
		})
	}
}
