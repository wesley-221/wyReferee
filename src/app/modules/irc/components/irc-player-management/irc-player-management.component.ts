import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MultiplayerLobbyMovePlayerComponent } from 'app/components/dialogs/multiplayer-lobby-move-player/multiplayer-lobby-move-player.component';
import { IMultiplayerLobbyMovePlayerDialogData } from 'app/interfaces/i-multiplayer-lobby-move-player-dialog-data';
import { IrcChannel } from 'app/models/irc/irc-channel';
import { Lobby } from 'app/models/lobby';
import { MultiplayerLobbyPlayers } from 'app/models/multiplayer-lobby-players/multiplayer-lobby-players';
import { MultiplayerLobbyPlayersPlayer } from 'app/models/multiplayer-lobby-players/multiplayer-lobby-players-player';
import { IrcService } from 'app/services/irc.service';
import { MultiplayerLobbyPlayersService } from 'app/services/multiplayer-lobby-players.service';

@Component({
	selector: 'app-irc-player-management',
	templateUrl: './irc-player-management.component.html',
	styleUrls: ['./irc-player-management.component.scss']
})
export class IrcPlayerManagementComponent implements OnInit, OnChanges {
	@Input() lobby: Lobby;
	@Input() channel: IrcChannel;

	multiplayerLobbyPlayers: MultiplayerLobbyPlayers;

	constructor(private ircService: IrcService, private dialog: MatDialog, private multiplayerLobbyPlayersService: MultiplayerLobbyPlayersService) { }

	ngOnInit(): void {
		if (this.lobby != undefined) {
			this.multiplayerLobbyPlayers = this.multiplayerLobbyPlayersService.multiplayerLobbies[this.lobby.lobbyId].players;
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.lobby) {
			const lobbyChange: SimpleChange = changes.lobby;

			if (!lobbyChange.isFirstChange()) {
				this.multiplayerLobbyPlayers = this.multiplayerLobbyPlayersService.multiplayerLobbies[this.lobby.lobbyId].players;
			}
		}
	}

	/**
	 * Move the player to a different slot
	 *
	 * @param player
	 */
	movePlayer(player: MultiplayerLobbyPlayersPlayer): void {
		const dialogRef = this.dialog.open(MultiplayerLobbyMovePlayerComponent, {
			data: {
				movePlayer: player,
				allPlayers: this.multiplayerLobbyPlayers
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
	changeTeam(player: MultiplayerLobbyPlayersPlayer): void {
		const newTeamColour = player.team == 'Red' ? 'blue' : 'red';
		this.ircService.sendMessage(this.channel.name, `!mp team ${player.username} ${newTeamColour}`);
	}

	/**
	 * Change the host to a different player
	 *
	 * @param player
	 */
	setHost(player: MultiplayerLobbyPlayersPlayer): void {
		this.ircService.sendMessage(this.channel.name, `!mp host ${player.username}`);
	}

	/**
	 * Kick the player from the match
	 *
	 * @param player
	 */
	kickPlayer(player: MultiplayerLobbyPlayersPlayer): void {
		this.ircService.sendMessage(this.channel.name, `!mp kick ${player.username}`);
	}
}
