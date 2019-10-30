import { Component, OnInit } from '@angular/core';
import { MultiplayerLobby } from '../../../models/store-multiplayer/multiplayer-lobby';
import { MultiplayerLobbiesService } from '../../../services/multiplayer-lobbies.service';
import { ToastService } from '../../../services/toast.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IrcService } from '../../../services/irc.service';

@Component({
	selector: 'app-create-lobby',
	templateUrl: './create-lobby.component.html',
	styleUrls: ['./create-lobby.component.scss']
})

export class CreateLobbyComponent implements OnInit {
	teamOneName: string;
	teamTwoName: string;
	multiplayerLobby: string;
	tournamentAcronym: string;
	matchDescription: string;

	validationForm: FormGroup;
	lobbyHasBeenCreated: boolean = false;

	constructor(private multiplayerLobbies: MultiplayerLobbiesService, private toastService: ToastService, private ircService: IrcService) { }

	ngOnInit() { 
		this.validationForm = new FormGroup({
			'multiplayerLink': new FormControl('', [
				Validators.pattern(/https\:\/\/osu.ppy.sh\/community\/matches\/[0-9]+/)
			]),
			'tournamentAcronym': new FormControl('', [
				Validators.maxLength(5)
			]),
			'teamOneName': new FormControl('', [
				Validators.required
			]),
			'teamTwoName': new FormControl('', [
				Validators.required
			])
		});
	}

	createLobby() {
		const newLobby = new MultiplayerLobby();
		
		newLobby.lobbyId = this.multiplayerLobbies.availableLobbyId;
		newLobby.teamOneName = this.validationForm.get('teamOneName').value;
		newLobby.teamTwoName = this.validationForm.get('teamTwoName').value;
		newLobby.multiplayerLink = this.validationForm.get('multiplayerLink').value;
		newLobby.tournamentAcronym = this.validationForm.get('tournamentAcronym').value;
		newLobby.description = `${this.validationForm.get('teamOneName').value} vs ${this.validationForm.get('teamTwoName').value}`;

		if(newLobby.multiplayerLink == '') {
			this.ircService.isCreatingMultiplayerLobby = newLobby.lobbyId;

			this.ircService.sendMessage('BanchoBot', `!mp make ${newLobby.tournamentAcronym}: (${newLobby.teamOneName}) vs (${newLobby.teamTwoName})`);
		}

		this.lobbyHasBeenCreated = true;

		setTimeout(() => {
			this.lobbyHasBeenCreated = false;
		}, 3000);

		this.multiplayerLobbies.add(newLobby);

		this.toastService.addToast(`Successfully created the multiplayer lobby ${newLobby.description}!`);
	}
}
