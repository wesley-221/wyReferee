export class CacheUser {
	user_id: number;
	username: string;

	constructor(init?: Partial<CacheUser>) {
		Object.assign(this, init);
	}
}
