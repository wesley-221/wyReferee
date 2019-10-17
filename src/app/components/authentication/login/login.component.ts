import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticateService } from '../../../services/authenticate.service';
import { ToastService } from '../../../services/toast.service';
import { ToastType } from '../../../models/toast';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	validationForm: FormGroup;
	
	constructor(private auth: AuthenticateService, private toastService: ToastService) { }

	ngOnInit() {
		this.validationForm = new FormGroup({
			'email': new FormControl('', [
				Validators.required
			]),
			'password': new FormControl('', [
				Validators.required
			])
		});
	}

	/**
	 * Login the user with the given email and password
	 */
	login() {
		const 	email = this.validationForm.get('email').value, 
				password = this.validationForm.get('password').value;

		this.auth.login(email, password).then(res => {
			this.toastService.addToast(`Successfully logged in with the email "${this.auth.loggedInUser}"!`);
		}).catch((err: Error) => {
			this.toastService.addToast(`Something went wrong while trying to login: "${err.message}"`, ToastType.Error);
		});
	}
}
