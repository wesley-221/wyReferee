import { MultiplayerLobbyPlayers } from 'app/models/multiplayer-lobby-players/multiplayer-lobby-players';
import { MultiplayerLobbyPlayersPlayer } from 'app/models/multiplayer-lobby-players/multiplayer-lobby-players-player';

export interface IMultiplayerLobbyMovePlayerDialogData {
	allPlayers: MultiplayerLobbyPlayers;
	movePlayer: MultiplayerLobbyPlayersPlayer;
	moveToSlot: number;
}
