import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IMultiplayerLobbySendFinalMessageDialogData } from 'app/interfaces/i-multiplayer-lobby-send-final-message-dialog-data';
import { LobbyViewComponent } from 'app/modules/lobby/components/lobby-view/lobby-view.component';
import { ToastService } from 'app/services/toast.service';
import { WybinService } from 'app/services/wybin.service';

@Component({
	selector: 'app-update-match-results-dialog',
	templateUrl: './update-match-results-dialog.component.html',
	styleUrl: './update-match-results-dialog.component.scss'
})
export class UpdateMatchResultsDialogComponent {
	validationForm: FormGroup;

	isQualifierLobby: boolean;
	isWinByDefault: boolean;
	isQualifierMatch: boolean;

	loading: boolean;

	constructor(@Inject(MAT_DIALOG_DATA) public data: IMultiplayerLobbySendFinalMessageDialogData, private dialogRef: MatDialogRef<LobbyViewComponent>, private wybinService: WybinService, private toastService: ToastService) {
		this.validationForm = new FormGroup({
			'match-outcome': new FormControl('', Validators.required),
			'winning-team': new FormControl('', Validators.required),
			'extra-message': new FormControl()
		})

		this.isQualifierLobby = data.multiplayerLobby && data.multiplayerLobby.isQualifierLobby;
		this.loading = false;
	}

	/**
	 * Updates the match results on wyBin
	 */
	updateResults() {
		const wyBinTournamentId = this.data.multiplayerLobby.tournament.wyBinTournamentId;

		if (wyBinTournamentId != null && wyBinTournamentId != undefined) {
			// Match is a qualifier lobby and should be updated to wyBin
			if (this.isQualifierLobby) {
				const qualifierIdentifier = this.data.multiplayerLobby.description.replace('Qualifier lobby:', '').trim();

				this.loading = true;

				this.wybinService.updateMatchScore(wyBinTournamentId,
					this.data.multiplayerLobby.wybinStageId,
					this.data.multiplayerLobby.wybinMatchId,
					this.data.multiplayerLobby.selectedStage.name,
					this.data.multiplayerLobby.multiplayerLink,
					this.data.multiplayerLobby.teamOneName,
					this.data.multiplayerLobby.teamTwoName,
					null,
					null,
					null,
					null,
					null,
					qualifierIdentifier).subscribe({
						error: (err: HttpErrorResponse) => {
							this.toastService.addToast(err.error.message);
						},
						complete: () => {
							this.closeDialog(null, null);
						}
					});
			}
			// Match is a regular match and should be updated to wyBin
			else {
				const matchStanding = this.getMatchStanding();

				this.loading = true;

				this.wybinService.updateMatchScore(wyBinTournamentId,
					this.data.multiplayerLobby.wybinStageId,
					this.data.multiplayerLobby.wybinMatchId,
					this.data.multiplayerLobby.selectedStage.name,
					this.data.multiplayerLobby.multiplayerLink,
					this.data.multiplayerLobby.teamOneName,
					this.data.multiplayerLobby.teamTwoName,
					this.data.multiplayerLobby.getTeamOneScore(),
					this.data.multiplayerLobby.getTeamTwoScore(),
					this.validationForm.get('winning-team').value,
					this.data.multiplayerLobby.teamOneBans,
					this.data.multiplayerLobby.teamTwoBans,
					null).subscribe({
						error: (err: HttpErrorResponse) => {
							this.toastService.addToast(err.error.message);
						},
						complete: () => {
							this.closeDialog(matchStanding.winningTeam, matchStanding.losingTeam);
						}
					});
			}
		}
		// No wyBin tournament associated with this lobby
		else {
			if (this.isQualifierLobby == true) {
				this.closeDialog(null, null);
			}
			else {
				const matchStanding = this.getMatchStanding();

				this.closeDialog(matchStanding.winningTeam, matchStanding.losingTeam);
			}
		}
	}

	/**
	 * Closes the dialog
	 */
	closeDialog(winningTeam: string, losingTeam: string): void {
		this.dialogRef.close({
			winningTeam: winningTeam,
			losingTeam: losingTeam,
			winByDefault: this.isWinByDefault,
			multiplayerLobby: this.data.multiplayerLobby,
			extraMessage: this.validationForm.get('extra-message').value,
			qualifierLobby: this.isQualifierLobby
		});
	}

	/**
	 * Handles when the match outcome is changed
	 *
	 * @param event the change event
	 */
	changeMatchOutcome(event: MatButtonToggleChange) {
		this.isWinByDefault = event.value == 'win-by-default' ? true : false;
		this.isQualifierMatch = event.value == 'qualifier-result' ? true : false;

		if (this.isWinByDefault) {
			this.validationForm.get('winning-team').setValue('no-one');
		}
		else {
			this.validationForm.get('winning-team').setValue(null);
		}
	}

	/**
	 * Gets the match standing based on the current form values
	 */
	private getMatchStanding(): { winningTeam: string, losingTeam: string } {
		if (this.isWinByDefault) {
			return {
				winningTeam: this.validationForm.get('winning-team').value,
				losingTeam: this.validationForm.get('winning-team').value == this.data.multiplayerLobby.teamOneName ? this.data.multiplayerLobby.teamTwoName : this.data.multiplayerLobby.teamOneName
			};
		}
		else {
			return {
				winningTeam: this.data.multiplayerLobby.getTeamOneScore() > this.data.multiplayerLobby.getTeamTwoScore() ? this.data.multiplayerLobby.teamOneName : this.data.multiplayerLobby.teamTwoName,
				losingTeam: this.data.multiplayerLobby.getTeamOneScore() > this.data.multiplayerLobby.getTeamTwoScore() ? this.data.multiplayerLobby.teamTwoName : this.data.multiplayerLobby.teamOneName
			};
		}
	}
}
