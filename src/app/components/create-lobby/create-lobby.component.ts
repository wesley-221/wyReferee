import { Component, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { MultiplayerLobby } from '../../models/multiplayer-lobby';
import { MultiplayerLobbiesService } from '../../services/multiplayer-lobbies.service';
import { ToastService } from '../../services/toast.service';

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

	constructor(private multiplayerLobbies: MultiplayerLobbiesService, private toastService: ToastService) { }

	ngOnInit() { }

	createLobby() {
		const newLobby = new MultiplayerLobby();

		newLobby.lobbyId = this.multiplayerLobbies.availableLobbyId;
		
		// Increment lobby id
		this.multiplayerLobbies.availableLobbyId;

		newLobby.teamOneName = this.teamOneName;
		newLobby.teamTwoName = this.teamTwoName;
		newLobby.multiplayerLink = this.multiplayerLobby;
		newLobby.description = `${this.teamOneName} vs ${this.teamTwoName}`;

		this.multiplayerLobbies.add(newLobby);

		this.toastService.addToast(`Successfully created the multiplayer lobby ${newLobby.description}!`);
	}
}
