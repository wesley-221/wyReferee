export class LoggedInUser {
	id: number;
	username: string;
	admin: boolean;
	tournamentHost: boolean;

	public static mapFromJson(json: any): LoggedInUser {
		const loggedInUser = new LoggedInUser();

		loggedInUser.id = json.id;
		loggedInUser.username = json.username;
		loggedInUser.admin = json.admin;
		loggedInUser.tournamentHost = json.tournamentHost;

		for (const role in json.roles) {
			if (json.roles[role].name == 'Tournament manager') {
				loggedInUser.tournamentHost = true;
			}

			if (json.roles[role].name == 'Administrator') {
				loggedInUser.admin = true;
			}
		}

		return loggedInUser;
	}

	/**
	 * Convert the user to a json file
	 */
	public convertToJson(): { id: number; username: string; admin: boolean; tournamentHost: boolean } {
		return {
			id: this.id,
			username: this.username,
			admin: this.admin,
			tournamentHost: this.tournamentHost,
		};
	}
}
