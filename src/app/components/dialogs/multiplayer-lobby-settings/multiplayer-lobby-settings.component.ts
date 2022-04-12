import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { IMultiplayerLobbySettingsDialogData } from 'app/interfaces/i-multiplayer-lobby-settings-dialog-data';

@Component({
	selector: 'app-multiplayer-lobby-settings',
	templateUrl: './multiplayer-lobby-settings.component.html',
	styleUrls: ['./multiplayer-lobby-settings.component.scss']
})
export class MultiplayerLobbySettingsComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: IMultiplayerLobbySettingsDialogData) { }
	ngOnInit(): void { }

	/**
	 * Change various settings for the lobby
	 *
	 * @param element
	 * @param event
	 */
	change(element: string, event: MatSelectChange) {
		if (element == 'firstPick') {
			this.data.multiplayerLobby.firstPick = event.value;
		}
		else if (element == 'bestOf') {
			this.data.multiplayerLobby.bestOf = event.value;
		}
	}
}
