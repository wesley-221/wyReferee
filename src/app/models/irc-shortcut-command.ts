import { Lobby } from "./lobby";

export class IrcShortcutCommand {
	label: string;
	command: string;
	warning: boolean;

	constructor(init?: Partial<IrcShortcutCommand>) {
		Object.assign(this, init);
	}

	/**
	 * Parse variables in the current command
	 * @param selectedLobby a lobby where we get data from
	 */
	parseIrcCommand(selectedLobby: Lobby): string {
		let teamOneSlotArray = [];
		let teamTwoSlotArray = [];

		for (let i: any = 0; i < selectedLobby.teamSize * 2; i++) {
			if (i < selectedLobby.teamSize) {
				teamOneSlotArray.push(parseInt(i) + 1);
			}
			else {
				teamTwoSlotArray.push(parseInt(i) + 1);
			}
		}

		const replaceWords = {
			"{{\\s{0,}team1\\s{0,}}}": selectedLobby.teamOneName,
			"{{\\s{0,}team2\\s{0,}}}": selectedLobby.teamTwoName,
			"{{\\s{0,}team1slots\\s{0,}}}": teamOneSlotArray.join(', '),
			"{{\\s{0,}team2slots\\s{0,}}}": teamTwoSlotArray.join(', '),
			"{{\\s{0,}team1colour\\s{0,}}}": "Red",
			"{{\\s{0,}team2colour\\s{0,}}}": "Blue"
		};

		let ircCommand = this.command;

		for (const regex in replaceWords) {
			ircCommand = ircCommand.replace(new RegExp(regex), replaceWords[regex]);
		}

		return ircCommand;
	}

	static makeTrueCopy(ircShortcutCommand: IrcShortcutCommand): IrcShortcutCommand {
		return new IrcShortcutCommand({
			label: ircShortcutCommand.label,
			command: ircShortcutCommand.command,
			warning: ircShortcutCommand.warning
		});
	}
}
