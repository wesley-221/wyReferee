import { MultiplayerDataUser, Team } from '../../store-multiplayer/multiplayer-data-user';

/**
 * An interface with some methods that help you implement different score calculations
 */
export abstract class ScoreInterface {
	private identifier: string;
	private description: string;
	private teamSize: number;
	private soloTournament: boolean;
	private allUsers: MultiplayerDataUser[];
	private teamRedUsers: MultiplayerDataUser[];
	private teamBlueUsers: MultiplayerDataUser[];
	private useStaticSlots: boolean;

	/**
	 * Initialize the score interface with the given identifier
	 *
	 * @param identifier the identifier of the score interface
	 */
	constructor(identifier: string) {
		this.identifier = identifier;
		this.allUsers = [];
		this.teamRedUsers = [];
		this.teamBlueUsers = [];
		this.soloTournament = null;
		this.useStaticSlots = false;
	}

	/**
	 * Add a user to the current score interface
	 *
	 * @param user the user to add
	 */
	public addUserScore(user: MultiplayerDataUser) {
		if (user == undefined) {
			return;
		}

		this.allUsers.push(user);
	}

	/**
	 * Adds several users to the current score interface
	 *
	 * @param users the users object to add
	 */
	public addUserScores(users: MultiplayerDataUser[]) {
		for (const user of users) {
			this.addUserScore(user);
		}

		this.populateTeamArrays();
	}

	/**
	 * Get all the users of the current score interface
	 */
	public getUserScores(): MultiplayerDataUser[] {
		return this.allUsers;
	}

	/**
	 * Get a user by the given slot
	 *
	 * @param slot
	 */
	public getUserBySlot(slot: number): MultiplayerDataUser {
		for (const user of this.allUsers) {
			if (user.slot == slot) {
				return user;
			}
		}

		const newUser = new MultiplayerDataUser();
		newUser.slot = slot;
		newUser.score = 0;
		newUser.passed = 0;
		newUser.accuracy = 0;
		newUser.mods = null;

		return newUser;
	}

	/**
	 * Gets all the users that are part of team red
	 */
	public getTeamRedUsers(): MultiplayerDataUser[] {
		return this.teamRedUsers;
	}

	/**
	 * Get all the users that are part of team blue
	 */
	public getTeamBlueUsers(): MultiplayerDataUser[] {
		return this.teamBlueUsers;
	}

	/**
	 * Get the identifier of the score interface
	 */
	public getIdentifier(): string {
		return this.identifier;
	}

	/**
	 * Set the size of the teams
	 *
	 * @param teamSize the size of a single team
	 */
	public setTeamSize(teamSize: number): void {
		this.teamSize = teamSize;

		// Initialize the array with empty users
		for (let i = 0; i < this.teamSize * 2; i++) {
			this.addUserScore(this.getUserBySlot(i));
		}
	}

	/**
	 * Get the team size of the score interface
	 */
	public getTeamSize(): number {
		return this.teamSize;
	}

	/**
	 * Get the description of the score interface
	 */
	public getDescription(): string {
		return this.description;
	}

	/**
	 * Set the description of the score interface
	 *
	 * @param description the description
	 */
	public setDescription(description: string): void {
		this.description = description;
	}

	/**
	 * Check if the tournament is a solo tournament or a team tournament
	 */
	public isSoloTournament(): boolean {
		return this.soloTournament;
	}

	/**
	 * Set the format of the tournament
	 *
	 * @param solo true for solo, false for teams
	 */
	public setSoloTournament(solo: boolean): void {
		this.soloTournament = solo;
	}

	/**
	 * Set whether to use static slots or not. This is only to properly visualize the lobby screen.
	 * The actual score calculations should be done in the appropriate score interface
	 *
	 * @param useStaticSlots whether to use static slots or not
	 */
	public setUseStaticSlots(useStaticSlots: boolean): void {
		this.useStaticSlots = useStaticSlots;
	}

	/**
	 * Populates the team arrays with the appropriate players
	 */
	private populateTeamArrays(): void {
		for (const player of this.allUsers) {
			if (player.team == Team.Red) {
				this.teamRedUsers.push(player);
			}
			else if (player.team == Team.Blue) {
				this.teamBlueUsers.push(player);
			}
		}
	}

	/**
	 * Calculate the score of the given player
	 *
	 * @param player the player object to use the score calculations with
	 * @returns the score of the player
	 */
	public abstract calculatePlayerScore(player: MultiplayerDataUser): number;

	/**
	 * Calculate the final score of team one
	 *
	 * @returns the score of the team
	 */
	public abstract calculateTeamOneScore(): number;

	/**
	 * Calculate the final score of team two
	 *
	 * @returns the score of the team
	 */
	public abstract calculateTeamTwoScore(): number;
}
