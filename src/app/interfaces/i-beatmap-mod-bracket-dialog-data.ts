import { Lobby } from 'app/models/lobby';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WyModBracketMap } from 'app/models/wytournament/mappool/wy-mod-bracket-map';

export interface IBeatmapModBracketDialogData {
	beatmap: WyModBracketMap;
	modBracket: WyModBracket;
	lobby: Lobby;
}
