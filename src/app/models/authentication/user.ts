import { Role } from './role';
import { UserOsu } from './user-osu';

export class User {
	id: number;
	slug: string;
	username: string;
	isAdmin: boolean;
	isTournamentManager: boolean;
	uploadSecretKey: string;
	uploadSecret: string;
	password: string;
	passwordConfirm: string;
	roles: Role[] = [];
	userOsu: UserOsu;

	/**
	 * Return a role by the given name of the user
	 * @param name the name of a role
	 */
	public getRoleByName(name: string): Role {
		for (const role in this.roles) {
			if (this.roles[role].name === name) {
				return this.roles[role];
			}
		}

		return null;
	}

	/**
	 * Get the url of the profile of the user
	 */
	public getOsuProfileUrl(): string {
		return (this.userOsu !== null) ? `https://osu.ppy.sh/users/${this.userOsu.id}` : null;
	}

	/**
	 * Get the url of the avatar of the user
	 */
	public getAvatarUrl(): string {
		return (this.userOsu !== null) ? this.userOsu.avatar_url : null;
	}

	/**
	 * Get the url of the cover of the user
	 */
	public getCoverUrl(): string {
		return (this.userOsu !== null) ? this.userOsu.cover_url : null;
	}

	/**
	 * Check whether or not the user has an osu! account connected
	 */
	public hasOsuConnected(): boolean {
		return this.userOsu !== null;
	}

	/**
	 * Make a true copy of the user
	 */
	public static makeTrueCopy(user: User): User {
		const newUser = new User();

		newUser.id = user.id;
		newUser.slug = user.slug;
		newUser.username = user.username;
		newUser.isAdmin = user.isAdmin;
		newUser.isTournamentManager = user.isTournamentManager;
		newUser.uploadSecretKey = user.uploadSecretKey;
		newUser.uploadSecret = user.uploadSecret;
		newUser.password = user.password;
		newUser.passwordConfirm = user.passwordConfirm;
		newUser.roles = [];
		newUser.userOsu = UserOsu.makeTrueCopy(user.userOsu);

		for (const role in user.roles) {
			newUser.roles.push(Role.makeTrueCopy(user.roles[role]));

			if (user.roles[role].name == "Tournament manager") {
				newUser.isTournamentManager = true;
			}

			if (user.roles[role].name == "Administrator") {
				newUser.isAdmin = true;
			}
		}

		return newUser;
	}

	/**
	 * Serialize the given json to a User
	 * @param json the json to serialize
	 */
	public static serializeJson(json: any): User {
		const newUser = new User();

		newUser.id = json.id;
		newUser.slug = json.slug;
		newUser.username = json.username;
		newUser.isAdmin = json.isAdmin;
		newUser.isTournamentManager = json.isTournamentManager;
		newUser.uploadSecretKey = json.uploadSecretKey;
		newUser.uploadSecret = json.uploadSecret;
		newUser.password = json.password;
		newUser.passwordConfirm = json.passwordConfirm;
		newUser.userOsu = UserOsu.makeTrueCopy(json.userOsu);

		for (const role in json.roles) {
			newUser.roles.push(new Role({
				id: json.roles[role].id,
				name: json.roles[role].name,
				description: json.roles[role].description,
				permanent: json.roles[role].permanent
			}));
		}

		return newUser;
	}
}
