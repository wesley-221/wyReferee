export class CacheUser {
    user_id: number;
    username: string;

    constructor(user_id: number, username: string) {
        this.user_id = user_id;
        this.username = username;
    }
}