import { Lobby } from "app/models/lobby";

export interface ISendBeatmapResultDialogData {
	multiplayerLobby: Lobby;
	ircChannel: string;
}
