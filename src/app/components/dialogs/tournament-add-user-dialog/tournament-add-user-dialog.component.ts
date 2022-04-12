import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'app/models/authentication/user';
import { UserOsu } from 'app/models/authentication/user-osu';
import { ITournamentInviteDialogData } from 'app/interfaces/i-tournament-invite-dialog-data';
import { AppConfig } from 'environments/environment';

@Component({
	selector: 'app-tournament-add-user-dialog',
	templateUrl: './tournament-add-user-dialog.component.html',
	styleUrls: ['./tournament-add-user-dialog.component.scss']
})
export class TournamentAddUserDialogComponent implements OnInit {
	osuUsername: string;
	foundOsuUser: UserOsu;
	foundUser: User;
	error: string;

	constructor(@Inject(MAT_DIALOG_DATA) public data: ITournamentInviteDialogData, private http: HttpClient) { }

	ngOnInit(): void { }

	searchForUser(): void {
		this.http.get(`${AppConfig.apiUrl}user-from-osu-user/${this.osuUsername}/0`).subscribe((user: User) => {
			this.error = null;
			this.foundUser = User.makeTrueCopy(user);
			this.foundOsuUser = this.foundUser.userOsu;
		}, (error: HttpErrorResponse) => {
			this.error = error.error.message;
		});
	}
}
