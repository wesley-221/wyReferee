import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RegisterRequest } from '../../../models/authentication/register-request';
import { AuthenticateService } from '../../../services/authenticate.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	loginForm: FormGroup;
	loginErrors: string[] = [];

	constructor(private authenticateService: AuthenticateService, private toastService: ToastService) { }
	ngOnInit() {
		this.loginForm = new FormGroup({
			'username': new FormControl('', [
				Validators.required
			]),
			'password': new FormControl('', [
				Validators.required
			]),
			'password-confirmation': new FormControl('', [
				Validators.required
			])
		});

		this.loginForm.setValidators(this.isEqualTo('password', 'password-confirmation'));
	}

	register(): void {
		const username: AbstractControl = this.loginForm.get('username');
		const password: AbstractControl = this.loginForm.get('password');
		const passwordConfirm: AbstractControl = this.loginForm.get('password-confirmation');

		const errors: string[] = [];

		if (username.invalid) {
			errors.push('You have to fill in a username in order to register.');
		}

		if (password.invalid) {
			if (password.errors.required) {
				errors.push('You have to enter a password in order to register.');
			}
		}

		if (passwordConfirm.invalid) {
			if (passwordConfirm.errors.required) {
				errors.push('You have to enter the password confirmation in order to register.');
			}

			if (passwordConfirm.errors.notEquivalent) {
				errors.push('The passwords you have entered do not match.');
			}
		}

		if (errors.length > 0) {
			this.loginErrors = errors;
		}
		else {
			const registerUser = new RegisterRequest();

			registerUser.username = username.value;
			registerUser.password = password.value;
			registerUser.passwordConfirm = passwordConfirm.value;

			this.authenticateService.register(registerUser).subscribe(() => {
				this.loginErrors = [];

				this.toastService.addToast(`Successfully registered your account with the username "${registerUser.username}".`);
			}, (err: HttpErrorResponse) => {
				this.loginErrors = [];

				this.loginErrors.push(err.error.message);
			});
		}
	}

	private isEqualTo(type1: any, type2: any): ValidatorFn {
		return (checkForm: FormGroup): any => {
			const v1 = checkForm.controls[type1];
			const v2 = checkForm.controls[type2];

			return v1.value === v2.value ? v2.setErrors(null) : v2.setErrors({ notEquivalent: true });
		}
	}
}
