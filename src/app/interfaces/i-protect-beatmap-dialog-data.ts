import { Lobby } from "app/models/lobby";
import { WyModBracket } from "app/models/wytournament/mappool/wy-mod-bracket";
import { WyModBracketMap } from "app/models/wytournament/mappool/wy-mod-bracket-map";

export interface IProtectBeatmapDialogData {
	beatmap: WyModBracketMap;
	modBracket: WyModBracket;
	multiplayerLobby: Lobby;

	protectForTeam: string;
}
