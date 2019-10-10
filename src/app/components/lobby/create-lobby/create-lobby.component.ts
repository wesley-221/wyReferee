import { Component, OnInit } from '@angular/core';
import { MultiplayerLobby } from '../../../models/store-multiplayer/multiplayer-lobby';
import { MultiplayerLobbiesService } from '../../../services/multiplayer-lobbies.service';
import { ToastService } from '../../../services/toast.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
	selector: 'app-create-lobby',
	templateUrl: './create-lobby.component.html',
	styleUrls: ['./create-lobby.component.scss']
})

export class CreateLobbyComponent implements OnInit {
	teamOneName: string;
	teamTwoName: string;
	multiplayerLobby: string;

	matchDescription: string;

	validationForm: FormGroup;

	constructor(private multiplayerLobbies: MultiplayerLobbiesService, private toastService: ToastService) { }

	ngOnInit() { 
		this.validationForm = new FormGroup({
			'multiplayerLink': new FormControl('', [
				Validators.required,
				Validators.pattern(/https\:\/\/osu.ppy.sh\/community\/matches\/[0-9]+/)
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
		
		// Increment lobby id
		this.multiplayerLobbies.availableLobbyId;

		newLobby.teamOneName = this.validationForm.get('teamOneName').value;
		newLobby.teamTwoName = this.validationForm.get('teamTwoName').value;
		newLobby.multiplayerLink = this.validationForm.get('multiplayerLink').value;
		newLobby.description = `${this.validationForm.get('teamOneName').value} vs ${this.validationForm.get('teamTwoName').value}`;

		this.multiplayerLobbies.add(newLobby);

		this.toastService.addToast(`Successfully created the multiplayer lobby ${newLobby.description}!`);
	}
}
