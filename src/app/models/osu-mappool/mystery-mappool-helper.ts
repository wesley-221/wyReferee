import { MultiplayerLobby } from '../store-multiplayer/multiplayer-lobby';

export class MysteryMappoolHelper {
	mappoolId: number;
	modBracketId: number;
	multiplayerLobbyName: string;
	refereeName: string;
	pickedCategories: { modBracketName: string, categories: string[] }[];

	constructor(mappoolId: number, modBracketId: number, lobby: MultiplayerLobby, refereeName: string, pickedCategories: { modBracketName: string, categories: string[] }[]) {
		this.mappoolId = mappoolId;
		this.modBracketId = modBracketId;
		this.multiplayerLobbyName = `[${lobby.tournamentAcronym}: (${lobby.teamOneName}) vs (${lobby.teamTwoName})](${lobby.multiplayerLink})`;
		this.refereeName = refereeName;
		this.pickedCategories = pickedCategories;
	}
}
