export class LoggedInUser {
    userId: number;
    username: string;
    isAdmin: boolean;
    token: string;

    public static mapFromJson(json: any): LoggedInUser {
        const loggedInUser = new LoggedInUser();

        loggedInUser.userId = json.userId;
        loggedInUser.username = json.username;
        loggedInUser.isAdmin = json.isAdmin;
        loggedInUser.token = json.token;

        return loggedInUser;
    }

    /**
     * Convert the user to a json file
     */
    public convertToJson(): {} {
        return {
            userId: this.userId, 
            username: this.username, 
            isAdmin: this.isAdmin,
            token: this.token
        }
    }
}
