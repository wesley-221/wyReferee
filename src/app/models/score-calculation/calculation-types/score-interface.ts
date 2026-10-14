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
		newUser.countmiss = 0;

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
	 * @param initialize whether to initialize the user slots
	 */
	public setTeamSize(teamSize: number, initialize = true): void {
		this.teamSize = teamSize;

		if (initialize == true) {
			// Initialize the array with empty users
			for (let i = 0; i < this.teamSize * 2; i++) {
				this.addUserScore(this.getUserBySlot(i));
			}
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
	 * Check whether the score interface uses static slots
	 */
	public usesStaticSlots(): boolean {
		return this.useStaticSlots;
	}

	/**
	 * Get all the users that are in team one
	 */
	public getTeamOneUsers(): MultiplayerDataUser[] {
		if (this.usesStaticSlots()) {
			const users: MultiplayerDataUser[] = [];

			for (let i = 0; i < this.getTeamSize(); i++) {
				users.push(this.getUserBySlot(i));
			}

			return users;
		}

		return this.getTeamRedUsers();
	}

	/**
	 * Get all the users that are in team two
	 */
	public getTeamTwoUsers(): MultiplayerDataUser[] {
		if (this.usesStaticSlots()) {
			const users: MultiplayerDataUser[] = [];

			for (let i = this.getTeamSize(); i < this.getTeamSize() * 2; i++) {
				users.push(this.getUserBySlot(i));
			}

			return users;
		}

		return this.getTeamBlueUsers();
	}

	/**
	 * Calculate average accuracy for team one
	 */
	public calculateTeamOneAccuracy(): number {
		return this.calculateAverageAccuracy(this.getTeamOneUsers());
	}

	/**
	 * Calculate average accuracy for team two
	 */
	public calculateTeamTwoAccuracy(): number {
		return this.calculateAverageAccuracy(this.getTeamTwoUsers());
	}

	/**
	 * Calculate total misses for team one
	 */
	public calculateTeamOneMisses(): number {
		return this.calculateTotalMisses(this.getTeamOneUsers());
	}

	/**
	 * Calculate total misses for team two
	 */
	public calculateTeamTwoMisses(): number {
		return this.calculateTotalMisses(this.getTeamTwoUsers());
	}

	/**
	 * Populates the team arrays with the appropriate players
	 */
	private populateTeamArrays(): void {
		for (const player of this.allUsers) {
			if (player.team == Team.Red as number) {
				this.teamRedUsers.push(player);
			}
			else if (player.team == Team.Blue as number) {
				this.teamBlueUsers.push(player);
			}
		}
	}

	/**
	 * Calculate the average accuracy for the given players
	 *
	 * @param players the array of players to calculate the average accuracy for
	 */
	private calculateAverageAccuracy(players: MultiplayerDataUser[]): number {
		if (!players || players.length === 0) {
			return 0;
		}

		let totalAccuracy = 0;

		for (const player of players) {
			if (player && player.passed == 1) {
				totalAccuracy += Number(player.accuracy || 0);
			}
		}

		return Number((totalAccuracy / players.length).toFixed(2));
	}

	/**
	 * Calculate the total misses for the given players
	 *
	 * @param players the array of players to calculate the total misses for
	 */
	private calculateTotalMisses(players: MultiplayerDataUser[]): number {
		if (!players || players.length === 0) {
			return 0;
		}

		let totalMisses = 0;

		for (const player of players) {
			if (player) {
				totalMisses += Number(player.countmiss || 0);
			}
		}

		return totalMisses;
	}

	/**
	 * Calculate the score of the given player
	 *
	 * @param player the player object to use the score calculations with
	 * @param team the team the player belongs to
	 * @returns the score of the player
	 */
	public abstract calculatePlayerScore(player: MultiplayerDataUser, team?: number): number;

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
