export class ModCategory {
	id: number = null;
	validateIndex = 0;
	categoryName: string = null;

	/**
	 * Compare the current modcategory with the given modcategory
	 * @param modCategory the modcategory to compare with
	 */
	public compareTo(modCategory: ModCategory) {
		return (
			this.categoryName == modCategory.categoryName
		);
	}

	/**
	 * Convert the modcategory object to json format
	 */
	public static convertToJson(modCategory: ModCategory): any {
		return {
			id: modCategory.id,
			categoryName: modCategory.categoryName
		}
	}

	/**
     * Make a true copy of the given modCategory
     * @param modCategory the modCategory
     */
	public static makeTrueCopy(modCategory: ModCategory): ModCategory {
		const newModCategory = new ModCategory();

		newModCategory.id = modCategory.id;
		newModCategory.categoryName = modCategory.categoryName;

		return newModCategory;
	}

	/**
     * Serialize the json so that it gives back a ModCategory object
     * @param json the json to serialize
     */
	public static serializeJson(json: any): ModCategory {
		const newModCategory = new ModCategory();

		if (json != undefined) {
			newModCategory.id = json.id;
			newModCategory.categoryName = json.categoryName;
		}

		return newModCategory;
	}
}
