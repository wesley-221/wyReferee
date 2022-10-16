import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { IMultiplayerLobbySendFinalMessageDialogData } from 'app/interfaces/i-multiplayer-lobby-send-final-message-dialog-data';

@Component({
	selector: 'app-send-final-result',
	templateUrl: './send-final-result.component.html',
	styleUrls: ['./send-final-result.component.scss']
})
export class SendFinalResultComponent implements OnInit {
	firstStepFormGroup: FormGroup;
	secondStepFormGroup: FormGroup;

	isWinByDefault = false;

	canSend = false;

	constructor(@Inject(MAT_DIALOG_DATA) public data: IMultiplayerLobbySendFinalMessageDialogData) {
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

		if (this.isWinByDefault == false) {
			this.secondStepFormGroup.get('winning-team').setValue(null);
		}
	}

	nextStep() {
		this.firstStepFormGroup.markAllAsTouched();
		this.secondStepFormGroup.markAllAsTouched();
	}

	returnData(): IMultiplayerLobbySendFinalMessageDialogData {
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

		return {
			winningTeam: winningTeam,
			losingTeam: losingTeam,
			winByDefault: this.isWinByDefault,
			multiplayerLobby: this.data.multiplayerLobby,
			extraMessage: this.firstStepFormGroup.get('extra-message').value,
			qualifierLobby: this.firstStepFormGroup.get('match-outcome').value == 'qualifier-result' ? true : false
		};
	}
}
