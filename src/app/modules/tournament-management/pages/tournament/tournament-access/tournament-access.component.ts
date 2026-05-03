import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TournamentAddUserDialogComponent } from 'app/components/dialogs/tournament-add-user-dialog/tournament-add-user-dialog.component';
import { User } from 'app/models/authentication/user';
import { ToastType } from 'app/models/toast';
import { ElectronService } from 'app/services/electron.service';
import { ToastService } from 'app/services/toast.service';
import { WybinService } from 'app/services/wybin.service';
import { TournamentEditStateService } from '../../../services/tournament-edit-state.service';

@Component({
	selector: 'app-tournament-access',
	templateUrl: './tournament-access.component.html',
	styleUrls: ['./tournament-access.component.scss']
})
export class TournamentAccessComponent implements OnInit {
	tournament = this.tournamentEditStateService.getDraft$();

	importingFromWyBin: boolean;

	constructor(
		public electronService: ElectronService,
		private toastService: ToastService,
		private dialog: MatDialog,
		private wybinService: WybinService,
		private tournamentEditStateService: TournamentEditStateService
	) {
		this.importingFromWyBin = false;
	}

	ngOnInit(): void { }

	/**
	 * Import staff members from wyBin
	 */
	importWyBinStaff() {
		this.importingFromWyBin = true;

		const tournament = this.tournamentEditStateService.getCurrent();

		this.wybinService.importStaff(tournament.wyBinTournamentId).subscribe({
			next: (allStaff: any[]) => {
				const newAdmins = [...tournament.administrators];
				const newAvailableTo = [...tournament.availableTo];

				for (const staff of allStaff) {
					const user = User.makeTrueCopy(staff.user);

					const isHost = staff.roles.some(r => r.tournamentHostPermission === true);
					const isReferee = staff.roles.some(r => r.refereePermission === true);

					if (isHost && !newAdmins.find(u => u.id == user.id)) {
						newAdmins.push(user);
					}

					if (isReferee && !newAvailableTo.find(u => u.id == user.id)) {
						newAvailableTo.push(user);
					}
				}

				this.tournamentEditStateService.updateAccessState({
					administrators: newAdmins,
					availableTo: newAvailableTo
				});

				this.toastService.addToast('All staff members have been imported from wyBin.');

				this.importingFromWyBin = false;
			},
			error: (error: HttpErrorResponse) => {
				this.toastService.addToast(error.error.message, ToastType.Error);

				this.importingFromWyBin = false;
			}
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
				const currentDraft = this.tournamentEditStateService.getCurrent();
				const userExists = currentDraft.administrators.some(administrator => administrator.id === user.id);

				if (userExists) {
					this.toastService.addToast(`${user.username} is already an administrator.`, ToastType.Warning);
					return;
				}

				this.tournamentEditStateService.updateAccessState({
					administrators: [...currentDraft.administrators, User.makeTrueCopy(user)],
					availableTo: currentDraft.availableTo
				});

				this.toastService.addToast(`Successfully added ${user.username} as an administrator.`);
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
				const currentDraft = this.tournamentEditStateService.getCurrent();
				const userExists = currentDraft.availableTo.some(u => u.id === user.id);

				if (userExists) {
					this.toastService.addToast(`${user.username} already has access.`, ToastType.Warning);
					return;
				}

				this.tournamentEditStateService.updateAccessState({
					administrators: currentDraft.administrators,
					availableTo: [...currentDraft.availableTo, User.makeTrueCopy(user)]
				});

				this.toastService.addToast(`Successfully added ${user.username} to the tournament.`);
			}
		});
	}

	/**
	 * Remove an administrator from the tournament
	 *
	 * @param user the administrator to remove
	 */
	removeAdministrator(user: User): void {
		const currentDraft = this.tournamentEditStateService.getCurrent();

		this.tournamentEditStateService.updateAccessState({
			administrators: currentDraft.administrators.filter(administrator => administrator.id !== user.id),
			availableTo: currentDraft.availableTo
		});

		this.toastService.addToast(`Successfully removed ${user.username} from the administrators.`);
	}

	/**
	 * Remove a user from the tournament
	 *
	 * @param user the user to remove
	 */
	removeUser(user: User): void {
		const currentDraft = this.tournamentEditStateService.getCurrent();

		this.tournamentEditStateService.updateAccessState({
			administrators: currentDraft.administrators,
			availableTo: currentDraft.availableTo.filter(u => u.id !== user.id)
		});

		this.toastService.addToast(`Successfully removed ${user.username} from the tournament.`);
	}
}
