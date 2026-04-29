import { User } from "../../../models/authentication/user";

export interface TournamentAccessState {
	administrators: User[];
	availableTo: User[];
}
