import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TournamentAddUserDialogComponent } from 'app/components/dialogs/tournament-add-user-dialog/tournament-add-user-dialog.component';
import { User } from 'app/models/authentication/user';
import { ToastType } from 'app/models/toast';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ElectronService } from 'app/services/electron.service';
import { ToastService } from 'app/services/toast.service';
import { WybinService } from 'app/services/wybin.service';

@Component({
	selector: 'app-tournament-access',
	templateUrl: './tournament-access.component.html',
	styleUrls: ['./tournament-access.component.scss']
})
export class TournamentAccessComponent implements OnInit {
	@Input() tournament: WyTournament;

	importingFromWyBin: boolean;

	constructor(public electronService: ElectronService, private toastService: ToastService, private dialog: MatDialog, private wybinService: WybinService) {
		this.importingFromWyBin = false;
	}

	ngOnInit(): void { }

	/**
	 * Import staff members from wyBin
	 */
	importWyBinStaff() {
		this.importingFromWyBin = true;

		this.wybinService.importStaff(this.tournament.wyBinTournamentId).subscribe((allStaff: any[]) => {
			for (const staff of allStaff) {
				let isTournamentHost = false;
				let isReferee = false;

				for (const role of staff.roles) {
					if (role.tournamentHostPermission == true) {
						isTournamentHost = true;
						break;
					}

					if (role.refereePermission == true) {
						isReferee = true;
						break;
					}
				}

				if (isTournamentHost == true) {
					this.tournament.administrators.push(User.makeTrueCopy(staff.user));
				}

				if (isReferee == true) {
					this.tournament.availableTo.push(User.makeTrueCopy(staff.user));
				}
			}

			this.toastService.addToast('All staff members have been imported from wyBin');

			this.importingFromWyBin = false;
		}, (error: HttpErrorResponse) => {
			this.toastService.addToast(error.error.message, ToastType.Error);

			this.importingFromWyBin = false;
		});
	}

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
	 *
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
	 *
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
