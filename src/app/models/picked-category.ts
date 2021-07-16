export class PickedCategory {
	modBracketName: string;
	categories: string[];

	constructor(init?: Partial<PickedCategory>) {
		Object.assign(this, init);
	}

	public static makeTrueCopy(pickedCategory: PickedCategory): PickedCategory {
		return new PickedCategory({
			modBracketName: pickedCategory.modBracketName,
			categories: pickedCategory.categories
		});
	}
}
