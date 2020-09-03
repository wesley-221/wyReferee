import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MultiplayerLobbyMovePlayerDialogData } from 'app/components/irc/irc.component';
import { MultiplayerLobbyPlayersPlayer } from 'app/models/mutliplayer-lobby-players/multiplayer-lobby-players-player';

@Component({
	selector: 'app-multiplayer-lobby-move-player',
	templateUrl: './multiplayer-lobby-move-player.component.html',
	styleUrls: ['./multiplayer-lobby-move-player.component.scss']
})
export class MultiplayerLobbyMovePlayerComponent implements OnInit {
	selectedSlot: number;

	constructor(@Inject(MAT_DIALOG_DATA) public data: MultiplayerLobbyMovePlayerDialogData) { }
	ngOnInit(): void { }

	selectSlot(player: MultiplayerLobbyPlayersPlayer) {
		if (player.username == 'Open') {
			this.selectedSlot = player.slot;
		}
	}

	getData(): MultiplayerLobbyMovePlayerDialogData {
		return {
			allPlayers: this.data.allPlayers,
			movePlayer: this.data.movePlayer,
			moveToSlot: this.selectedSlot
		}
	}
}
