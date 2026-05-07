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
	firstPick: string;
	firstBan: string;
	bestOf: number;

	constructor(@Inject(MAT_DIALOG_DATA) public data: IMultiplayerLobbySettingsDialogData) { }

	ngOnInit(): void {
		this.firstPick = this.data.multiplayerLobby.firstPick;
		this.firstBan = this.data.multiplayerLobby.firstBan;
		this.bestOf = this.data.multiplayerLobby.bestOf;
	}

	/**
	 * Change various settings for the lobby
	 *
	 * @param element
	 * @param event
	 */
	change(element: string, event: MatSelectChange) {
		if (element == 'firstPick') {
			this.firstPick = event.value;
		}
		else if (element == 'firstBan') {
			this.firstBan = event.value;
		}
		else if (element == 'bestOf') {
			this.bestOf = event.value;
		}
	}

	close() {
		return { firstPick: this.firstPick, firstBan: this.firstBan, bestOf: this.bestOf };
	}
}
