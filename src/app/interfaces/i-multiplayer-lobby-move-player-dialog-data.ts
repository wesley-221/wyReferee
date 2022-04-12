import { MultiplayerLobbyPlayers } from 'app/models/mutliplayer-lobby-players/multiplayer-lobby-players';
import { MultiplayerLobbyPlayersPlayer } from 'app/models/mutliplayer-lobby-players/multiplayer-lobby-players-player';

export interface IMultiplayerLobbyMovePlayerDialogData {
	allPlayers: MultiplayerLobbyPlayers;
	movePlayer: MultiplayerLobbyPlayersPlayer;
	moveToSlot: number;
}
