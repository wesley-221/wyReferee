export class UserOsu {
	id: number;
	username: string;
	flag: string;
	pp: number;
	rank: number;
	cover_url: string;
	avatar_url: string;
	location: string;

	constructor(init?: Partial<UserOsu>) {
		Object.assign(this, init);
	}

	/**
	 * Make a true copy of the user
	 */
	public static makeTrueCopy(userOsu: UserOsu): UserOsu {
		if (userOsu == null) {
			return null;
		}

		return new UserOsu({
			id: userOsu.id,
			username: userOsu.username,
			flag: userOsu.flag,
			pp: userOsu.pp,
			rank: userOsu.rank,
			cover_url: userOsu.cover_url,
			avatar_url: userOsu.avatar_url,
			location: userOsu.location
		});
	}

	/**
	 * Get the flag of the user
	 */
	getFlagImageUrl(): string {
		return `/assets/images/flags/${this.flag}.png`.toLowerCase();
	}

	/**
	 * Get the url to the users osu! profile
	 */
	getOsuProfileUrl(): string {
		return `https://osu.ppy.sh/users/${this.id}`;
	}

	/**
	 * Check if the user is eligible to join a tournament
	 *
	 * @param minimumRank the minimum rank the user has to be
	 * @param maximumRank the maximum rank the user has to be
	 */
	isEligibleToJoin(minimumRank: number, maximumRank: number): boolean {
		if (minimumRank == null && maximumRank == null) {
			return true;
		}

		return this.rank >= minimumRank && this.rank <= maximumRank;
	}
}
