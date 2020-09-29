import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthenticateService } from 'app/services/authenticate.service';
import { ToastService } from 'app/services/toast.service';
import { RegisterRequest } from 'app/models/authentication/register-request';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	registrationForm: FormGroup;
	loginErrors: string[] = [];

	constructor(private authenticateService: AuthenticateService, private toastService: ToastService) {
		this.registrationForm = new FormGroup({
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

		this.registrationForm.setValidators(this.isEqualTo('password', 'password-confirmation'));
	}

	ngOnInit() { }

	register(): void {
		if (this.registrationForm.valid) {
			const username: AbstractControl = this.registrationForm.get('username');
			const password: AbstractControl = this.registrationForm.get('password');
			const passwordConfirm: AbstractControl = this.registrationForm.get('password-confirmation');

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
		else {
			this.registrationForm.markAllAsTouched();
		}
	}

	private isEqualTo(type1: any, type2: any): ValidatorFn {
		return (checkForm: FormGroup): any => {
			const v1 = checkForm.controls[type1];
			const v2 = checkForm.controls[type2];

			return v1.value === v2.value ? null : v2.setErrors({ notEquivalent: true });
		}
	}
}
