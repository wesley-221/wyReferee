import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MultiplayerLobbyMovePlayerComponent } from 'app/components/dialogs/multiplayer-lobby-move-player/multiplayer-lobby-move-player.component';
import { IMultiplayerLobbyMovePlayerDialogData } from 'app/interfaces/i-multiplayer-lobby-move-player-dialog-data';
import { IrcChannel } from 'app/models/irc/irc-channel';
import { Lobby } from 'app/models/lobby';
import { MultiplayerLobbyPlayersPlayer } from 'app/models/multiplayer-lobby-players/multiplayer-lobby-players-player';
import { IrcService } from 'app/services/irc.service';

@Component({
	selector: 'app-irc-player-management',
	templateUrl: './irc-player-management.component.html',
	styleUrls: ['./irc-player-management.component.scss']
})
export class IrcPlayerManagementComponent implements OnInit {
	@Input() lobby: Lobby;
	@Input() channel: IrcChannel;

	constructor(private ircService: IrcService, private dialog: MatDialog) { }
	ngOnInit(): void { }

	/**
	 * Move the player to a different slot
	 *
	 * @param player
	 */
	movePlayer(player: MultiplayerLobbyPlayersPlayer) {
		const dialogRef = this.dialog.open(MultiplayerLobbyMovePlayerComponent, {
			data: {
				movePlayer: player,
				allPlayers: this.lobby.multiplayerLobbyPlayers
			}
		});

		dialogRef.afterClosed().subscribe((result: IMultiplayerLobbyMovePlayerDialogData) => {
			if (result != undefined) {
				this.ircService.sendMessage(this.channel.name, `!mp move ${result.movePlayer.username} ${result.moveToSlot}`);
			}
		});
	}

	/**
	 * Change the colour of the current player
	 *
	 * @param player
	 */
	changeTeam(player: MultiplayerLobbyPlayersPlayer) {
		const newTeamColour = player.team == 'Red' ? 'blue' : 'red';
		this.ircService.sendMessage(this.channel.name, `!mp team ${player.username} ${newTeamColour}`);
	}

	/**
	 * Change the host to a different player
	 *
	 * @param player
	 */
	setHost(player: MultiplayerLobbyPlayersPlayer) {
		this.ircService.sendMessage(this.channel.name, `!mp host ${player.username}`);
	}

	/**
	 * Kick the player from the match
	 *
	 * @param player
	 */
	kickPlayer(player: MultiplayerLobbyPlayersPlayer) {
		this.ircService.sendMessage(this.channel.name, `!mp kick ${player.username}`);
	}
}
