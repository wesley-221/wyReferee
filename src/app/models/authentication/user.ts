export class User {
	id: number;
	username: string;
	slug: string;

	/**
	 * Map the json to a user object
	 * @param json
	 */
	public static mapFromJson(json: any): User {
		const newUser = new User();

		newUser.id = json.id;
		newUser.username = json.username;
		newUser.slug = json.slug;

		return newUser;
	}

	/**
     * Convert the user to a json format
	 * @param user the user
     */
	public convertToJson(user: User) {
		return {
			id: user.id,
			username: user.username,
			slug: user.slug
		};
	}

	/**
     * Make a true copy of the given user
     * @param user the user
     */
	public static makeTrueCopy(user: User) {
		const newUser = new User();

		newUser.id = user.id;
		newUser.username = user.username;
		newUser.slug = user.slug;

		return newUser;
	}
}
