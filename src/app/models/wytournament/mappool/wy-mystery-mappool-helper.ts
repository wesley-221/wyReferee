export class WyMysteryMappoolHelper {
	mappoolId: number;
	modBracketId: number;
	multiplayerLobbyName: string;
	refereeName: string;
	pickedCategories: { modBracketName: string, categories: string[] }[];

	constructor(init?: Partial<WyMysteryMappoolHelper>) {
		this.pickedCategories = [];
		Object.assign(this, init);
	}
}
