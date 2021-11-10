import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MultiplayerLobbyDeleteDialogData } from 'app/components/lobby/all-lobbies/all-lobbies.component';

@Component({
	selector: 'app-delete-lobby',
	templateUrl: './delete-lobby.component.html',
	styleUrls: ['./delete-lobby.component.scss']
})
export class DeleteLobbyComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: MultiplayerLobbyDeleteDialogData) { }
	ngOnInit(): void { }

	/**
	 * Get the name of the lobby
	 */
	getLobbyName(): string {
		return this.data.multiplayerLobby.tournament != null ? `${this.data.multiplayerLobby.tournament.acronym}: ${this.data.multiplayerLobby.description}` : this.data.multiplayerLobby.description;
	}
}
