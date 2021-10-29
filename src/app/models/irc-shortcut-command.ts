export class IrcShortcutCommand {
	label: string;
	command: string;

	constructor(init?: Partial<IrcShortcutCommand>) {
		Object.assign(this, init);
	}

	static makeTrueCopy(ircShortcutCommand: IrcShortcutCommand): IrcShortcutCommand {
		return new IrcShortcutCommand({
			label: ircShortcutCommand.label,
			command: ircShortcutCommand.command
		});
	}
}
