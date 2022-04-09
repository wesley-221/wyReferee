import { Injectable } from '@angular/core';
import { IrcShortcutCommand } from 'app/models/irc-shortcut-command';
import { StoreService } from './store.service';

@Injectable({
	providedIn: 'root'
})
export class IrcShortcutCommandsService {
	ircShortCutCommands: IrcShortcutCommand[];

	constructor(private storeService: StoreService) {
		this.loadIrcShortcutCommands();
	}

	/**
	 * Create a new irc shortcut command
	 *
	 * @param label the label of the command
	 * @param command the message being sent to irc
	 */
	addIrcShortcutCommand(label: string, command: string, warning = false): void {
		const newCommand = new IrcShortcutCommand({ label: label, command: command, warning: warning });

		this.ircShortCutCommands.push(newCommand);
	}


	/**
	 * Remove an irc shortcut command
	 *
	 * @param label the label of the command to remove
	 */
	removeIrcShortcutCommand(label: string): void {
		for (const ircShortCutCommand in this.ircShortCutCommands) {
			if (this.ircShortCutCommands[ircShortCutCommand].label == label) {
				this.ircShortCutCommands.splice(Number(ircShortCutCommand), 1);

				break;
			}
		}
	}

	/**
	 * Save the irc shortcut commands
	 */
	saveIrcShortcutCommands(): void {
		this.storeService.set('irc-shortcut-commands', this.ircShortCutCommands);
	}

	/**
	 * Load all irc shortcut commands
	 */
	loadIrcShortcutCommands(): void {
		this.ircShortCutCommands = [];

		const allIrcShortcutCommands = this.storeService.get('irc-shortcut-commands');

		for (const ircShortcutCommand in allIrcShortcutCommands) {
			this.ircShortCutCommands.push(IrcShortcutCommand.makeTrueCopy(allIrcShortcutCommands[ircShortcutCommand]));
		}
	}
}
