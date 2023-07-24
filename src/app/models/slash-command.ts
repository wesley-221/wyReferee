export class SlashCommand {
	name: string;
	description: string;
	execute: () => void;

	constructor(init?: Partial<SlashCommand>) {
		Object.assign(this, init);
	}
}
