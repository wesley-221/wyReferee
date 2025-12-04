import { User } from "./user";

export class AuthenticationResponse {
	user: User;
	sessionId: string;

	constructor(init?: Partial<AuthenticationResponse>) {
		Object.assign(this, init);
	}

	static makeTrueCopy(authenticationResponse: AuthenticationResponse): AuthenticationResponse {
		return new AuthenticationResponse({
			user: User.makeTrueCopy(authenticationResponse.user),
			sessionId: authenticationResponse.sessionId
		});
	}
}
