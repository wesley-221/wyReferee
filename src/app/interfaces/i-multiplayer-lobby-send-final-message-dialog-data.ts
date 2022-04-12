import { Lobby } from 'app/models/lobby';

export interface IMultiplayerLobbySendFinalMessageDialogData {
	multiplayerLobby: Lobby;

	winByDefault: boolean;

	winningTeam: string;
	losingTeam: string;

	extraMessage: string;

	qualifierLobby: boolean;
}
