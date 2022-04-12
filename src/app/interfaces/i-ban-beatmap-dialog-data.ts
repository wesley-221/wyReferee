import { Lobby } from 'app/models/lobby';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WyModBracketMap } from 'app/models/wytournament/mappool/wy-mod-bracket-map';

export interface IBanBeatmapDialogData {
	beatmap: WyModBracketMap;
	modBracket: WyModBracket;
	multiplayerLobby: Lobby;

	banForTeam: string;
}
