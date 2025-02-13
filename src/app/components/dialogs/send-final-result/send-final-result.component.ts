import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { IMultiplayerLobbySendFinalMessageDialogData } from 'app/interfaces/i-multiplayer-lobby-send-final-message-dialog-data';
import { LobbyViewComponent } from 'app/modules/lobby/components/lobby-view/lobby-view.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'app/services/toast.service';
import { WybinService } from 'app/services/wybin.service';

@Component({
	selector: 'app-send-final-result',
	templateUrl: './send-final-result.component.html',
	styleUrls: ['./send-final-result.component.scss']
})
export class SendFinalResultComponent implements OnInit {
	firstStepFormGroup: FormGroup;
	secondStepFormGroup: FormGroup;

	isWinByDefault = false;
	isQualifierMatch = false;
	canSend = false;
	loading = false;

	constructor(@Inject(MAT_DIALOG_DATA) public data: IMultiplayerLobbySendFinalMessageDialogData, private dialogRef: MatDialogRef<LobbyViewComponent>, private http: HttpClient, private toastService: ToastService, private wybinService: WybinService) {
		this.firstStepFormGroup = new FormGroup({
			'match-outcome': new FormControl('', Validators.required),
			'extra-message': new FormControl()
		});

		this.secondStepFormGroup = new FormGroup({
			'winning-team': new FormControl('', Validators.required)
		});
	}

	ngOnInit(): void { }

	changeMatchOutcome(event: MatButtonToggleChange) {
		this.isWinByDefault = event.value == 'win-by-default' ? true : false;
		this.isQualifierMatch = event.value == 'qualifier-result' ? true : false;

		if (this.isWinByDefault == false) {
			this.secondStepFormGroup.get('winning-team').setValue(null);
		}
	}

	nextStep() {
		this.firstStepFormGroup.markAllAsTouched();
		this.secondStepFormGroup.markAllAsTouched();
	}

	returnData() {
		let winningTeam = null;
		let losingTeam = null;

		if (this.isWinByDefault) {
			winningTeam = this.secondStepFormGroup.get('winning-team').value;
			losingTeam = winningTeam == this.data.multiplayerLobby.teamOneName ? this.data.multiplayerLobby.teamTwoName : this.data.multiplayerLobby.teamOneName;
		}
		else {
			winningTeam = this.data.multiplayerLobby.getTeamOneScore() > this.data.multiplayerLobby.getTeamTwoScore() ? this.data.multiplayerLobby.teamOneName : this.data.multiplayerLobby.teamTwoName;
			losingTeam = this.data.multiplayerLobby.getTeamOneScore() > this.data.multiplayerLobby.getTeamTwoScore() ? this.data.multiplayerLobby.teamTwoName : this.data.multiplayerLobby.teamOneName;
		}

		const wyBinTournamentId = this.data.multiplayerLobby.tournament.wyBinTournamentId;

		if (wyBinTournamentId != null && wyBinTournamentId != undefined) {
			this.loading = true;
			let qualifierIdentifier = null;

			if (this.isQualifierMatch) {
				qualifierIdentifier = this.data.multiplayerLobby.description.replace('Qualifier lobby:', '').trim();
			}

			this.wybinService.updateMatchScore(wyBinTournamentId,
				this.data.multiplayerLobby.wybinStageId,
				this.data.multiplayerLobby.wybinMatchId,
				this.data.multiplayerLobby.selectedStage.name,
				this.data.multiplayerLobby.multiplayerLink,
				this.data.multiplayerLobby.teamOneName,
				this.data.multiplayerLobby.teamTwoName,
				this.data.multiplayerLobby.getTeamOneScore(),
				this.data.multiplayerLobby.getTeamTwoScore(),
				this.secondStepFormGroup.get('winning-team').value,
				this.data.multiplayerLobby.teamOneBans,
				this.data.multiplayerLobby.teamTwoBans,
				qualifierIdentifier).subscribe(() => {
					this.closeDialog(winningTeam, losingTeam);
				}, (err: HttpErrorResponse) => {
					this.toastService.addToast(err.error.message);
					this.closeDialog(winningTeam, losingTeam);
				});
		}
		else {
			this.closeDialog(winningTeam, losingTeam);
		}
	}

	closeDialog(winningTeam: string, losingTeam: string): void {
		this.dialogRef.close({
			winningTeam: winningTeam,
			losingTeam: losingTeam,
			winByDefault: this.isWinByDefault,
			multiplayerLobby: this.data.multiplayerLobby,
			extraMessage: this.firstStepFormGroup.get('extra-message').value,
			qualifierLobby: this.firstStepFormGroup.get('match-outcome').value == 'qualifier-result' ? true : false
		});
	}
}
