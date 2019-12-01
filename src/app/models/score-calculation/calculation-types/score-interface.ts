import { MultiplayerDataUser } from "../../store-multiplayer/multiplayer-data-user";

/**
 * An interface with some methods that help you implement different score calculations
 */
export abstract class ScoreInterface {
    private identifier: string;
    private allUsers: MultiplayerDataUser[];

    /**
     * Calculate the score of the given player
     * @param player the player object to use the score calculations with
     * @returns the score of the player
     */
    public abstract calculatePlayerScore(player: MultiplayerDataUser): number;

    /**
     * Calculate the final score of the given players
     * @param players the players to use the final team calculations on
     * @returns the score of the team
     */
    public abstract calculateTeamScore(...players: MultiplayerDataUser[]): number;

    /**
     * Initialize the score interface with the given identifier
     * @param identifier the identifier of the score interface
     */
    constructor(identifier: string) {
        this.identifier = identifier;
        this.allUsers = [];
    }

    /**
     * Add a user to the current score interface
     * @param user the user to add
     */
    public addUser(user: MultiplayerDataUser) {
        this.allUsers.push(user);
    }

    /**
     * Get all the users of the current score interface
     */
    public getUsers(): MultiplayerDataUser[] {
        return this.allUsers;
    }

    /**
     * Get the identifier of the score interface
     */
    public getIdentifier(): string {
        return this.identifier;
    }
}