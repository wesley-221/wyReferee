import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMultiplayerLobbyMovePlayerDialogData } from 'app/interfaces/i-multiplayer-lobby-move-player-dialog-data';
import { MultiplayerLobbyPlayersPlayer } from 'app/models/multiplayer-lobby-players/multiplayer-lobby-players-player';

@Component({
	selector: 'app-multiplayer-lobby-move-player',
	templateUrl: './multiplayer-lobby-move-player.component.html',
	styleUrls: ['./multiplayer-lobby-move-player.component.scss']
})
export class MultiplayerLobbyMovePlayerComponent implements OnInit {
	selectedSlot: number;

	constructor(@Inject(MAT_DIALOG_DATA) public data: IMultiplayerLobbyMovePlayerDialogData) { }
	ngOnInit(): void { }

	selectSlot(player: MultiplayerLobbyPlayersPlayer) {
		if (player.username == 'Open') {
			this.selectedSlot = player.slot;
		}
	}

	getData(): IMultiplayerLobbyMovePlayerDialogData {
		return {
			allPlayers: this.data.allPlayers,
			movePlayer: this.data.movePlayer,
			moveToSlot: this.selectedSlot
		};
	}
}
