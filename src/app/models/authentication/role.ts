export class Role {
	id: number;
	name: string;
	description: string;
	permanent: boolean;

	constructor(init?: Partial<Role>) {
		Object.assign(this, init);
	}

	/**
	 * Make a true copy of the given object
	 *
	 * @param role the role to make a true copy of
	 */
	public static makeTrueCopy(role: Role): Role {
		return new Role({
			id: role.id,
			name: role.name,
			description: role.description,
			permanent: role.permanent
		});
	}
}
