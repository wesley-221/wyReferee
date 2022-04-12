import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMultiplayerLobbyDeleteDialogData } from 'app/interfaces/i-multiplayer-lobby-delete-dialog-data';

@Component({
	selector: 'app-delete-lobby',
	templateUrl: './delete-lobby.component.html',
	styleUrls: ['./delete-lobby.component.scss']
})
export class DeleteLobbyComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: IMultiplayerLobbyDeleteDialogData) { }
	ngOnInit(): void { }

	/**
	 * Get the name of the lobby
	 */
	getLobbyName(): string {
		return this.data.multiplayerLobby.tournament != null ? `${this.data.multiplayerLobby.tournament.acronym}: ${this.data.multiplayerLobby.description}` : this.data.multiplayerLobby.description;
	}
}
