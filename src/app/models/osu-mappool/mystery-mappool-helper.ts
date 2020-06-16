import { MultiplayerLobby } from "../store-multiplayer/multiplayer-lobby";

export class MysteryMappoolHelper {
	mappoolId: number;
	modBracketId: number;
	multiplayerLobbyName: String;
	refereeName: String;
	pickedCategories: { modBracketName: String, categories: String[] }[];

	constructor(mappoolId: number, modBracketId: number, lobby: MultiplayerLobby, refereeName: String, pickedCategories: { modBracketName: String, categories: String[] }[]) {
		this.mappoolId = mappoolId;
		this.modBracketId = modBracketId;
		this.multiplayerLobbyName = `[${lobby.tournamentAcronym}: (${lobby.teamOneName}) vs (${lobby.teamTwoName})](${lobby.multiplayerLink})`;
		this.refereeName = refereeName;
		this.pickedCategories = pickedCategories;
	}
}
