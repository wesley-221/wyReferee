import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMultiplayerLobbyDeleteDialogData } from 'app/interfaces/i-multiplayer-lobbies-delete-dialog-data';

@Component({
	selector: 'app-delete-lobbies-dialog',
	templateUrl: './delete-lobbies-dialog.component.html',
	styleUrl: './delete-lobbies-dialog.component.scss'
})
export class DeleteLobbiesDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: IMultiplayerLobbyDeleteDialogData) { }
}
