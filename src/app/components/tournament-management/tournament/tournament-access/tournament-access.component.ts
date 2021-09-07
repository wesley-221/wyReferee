import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TournamentAddUserDialogComponent } from 'app/components/dialogs/tournament-add-user-dialog/tournament-add-user-dialog.component';
import { User } from 'app/models/authentication/user';
import { ToastType } from 'app/models/toast';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ElectronService } from 'app/services/electron.service';
import { ToastService } from 'app/services/toast.service';

@Component({
	selector: 'app-tournament-access',
	templateUrl: './tournament-access.component.html',
	styleUrls: ['./tournament-access.component.scss']
})
export class TournamentAccessComponent implements OnInit {
	@Input() tournament: WyTournament;

	constructor(public electronService: ElectronService, private toastService: ToastService, private dialog: MatDialog) { }
	ngOnInit(): void { }

	/**
	 * Add a new user as an administrator
	 */
	addUserAsAdministrator(): void {
		const dialogRef = this.dialog.open(TournamentAddUserDialogComponent, {
			data: {
				administrator: true,
				access: false
			}
		});

		dialogRef.afterClosed().subscribe((user: User) => {
			if (user !== undefined) {
				let foundUser = false;

				for (const administrator of this.tournament.administrators) {
					if (administrator.id == user.id) {
						foundUser = true;
						break;
					}
				}

				if (foundUser != true) {
					this.tournament.administrators.push(User.makeTrueCopy(user));
				}
				else {
					this.toastService.addToast(`${user.username} is already an administrator.`, ToastType.Warning);
				}
			}
		});
	}

	/**
	 * Add the user to the tournament
	 */
	addNewUser(): void {
		const dialogRef = this.dialog.open(TournamentAddUserDialogComponent, {
			data: {
				administrator: false,
				access: true
			}
		});

		dialogRef.afterClosed().subscribe((user: User) => {
			if (user !== undefined) {
				let foundUser = false;

				for (const findUser of this.tournament.availableTo) {
					if (findUser.id == user.id) {
						foundUser = true;
						break;
					}
				}

				if (foundUser != true) {
					this.tournament.availableTo.push(User.makeTrueCopy(user));
				}
				else {
					this.toastService.addToast(`${user.username} already has access.`, ToastType.Warning);
				}
			}
		});
	}

	/**
	 * Remove an administrator from the tournament
	 * @param user the administrator to remove
	 */
	removeAdministrator(user: User): void {
		for (const administrator in this.tournament.administrators) {
			if (this.tournament.administrators[administrator].id == user.id) {
				this.tournament.administrators.splice(Number(administrator), 1);

				this.toastService.addToast(`Successfully removed ${user.username} from the administrators.`);
				break;
			}
		}
	}

	/**
	 * Remove a user from the tournament
	 * @param user the user to remove
	 */
	removeUser(user: User): void {
		for (const findUser in this.tournament.availableTo) {
			if (this.tournament.availableTo[findUser].id == user.id) {
				this.tournament.availableTo.splice(Number(findUser), 1);

				this.toastService.addToast(`Successfully revoked the access from ${user.username}.`);
				break;
			}
		}
	}
}
