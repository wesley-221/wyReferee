import { Injectable } from '@angular/core';
import { IrcShortcutCommand } from 'app/models/irc-shortcut-command';
import { IrcShortcutCommandsStoreService } from './storage/irc-shortcut-commands-store.service';
import { filter, take } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class IrcShortcutCommandsService {
	ircShortcutCommands: IrcShortcutCommand[];

	private highestId = 0;

	constructor(private ircShortcutCommandsStore: IrcShortcutCommandsStoreService) {
		this.loadIrcShortcutCommands();
	}

	/**
	 * Create a new irc shortcut command
	 *
	 * @param label the label of the command
	 * @param command the message being sent to irc
	 */
	addIrcShortcutCommand(label: string, command: string, warning = false): void {
		const newCommand = new IrcShortcutCommand({ id: this.highestId, label: label, command: command, warning: warning });

		this.highestId++;

		this.ircShortcutCommands.push(newCommand);
		this.ircShortcutCommandsStore.saveIrcShortcutCommand(newCommand);
	}


	/**
	 * Remove an irc shortcut command
	 *
	 * @param label the label of the command to remove
	 */
	removeIrcShortcutCommand(ircShortcutCommand: IrcShortcutCommand): void {
		const index = this.ircShortcutCommands.findIndex(cmd => cmd.id === ircShortcutCommand.id);

		if (index !== -1) {
			this.ircShortcutCommands.splice(index, 1);
			this.ircShortcutCommandsStore.deleteIrcShortcutCommand(ircShortcutCommand);
		}
	}

	/**
	 * Save the irc shortcut commands
	 */
	saveIrcShortcutCommands(): void {
		for (const command of this.ircShortcutCommands) {
			if (command.id == undefined || command.id == null) {
				command.id = this.highestId;
				this.highestId++;
			}
		}

		this.ircShortcutCommandsStore.saveAllShortcutCommands(this.ircShortcutCommands);
	}

	/**
	 * Load all irc shortcut commands
	 */
	loadIrcShortcutCommands(): void {
		this.ircShortcutCommandsStore
			.watchIrcShortcutCommands()
			.pipe(
				filter(commands => commands !== null),
				take(1)
			)
			.subscribe(loadedIrcShortcutCommands => {
				this.ircShortcutCommands = [];

				const allIrcShortcutCommands = Object.values(loadedIrcShortcutCommands);

				for (const ircShortcutCommand of allIrcShortcutCommands) {
					this.ircShortcutCommands.push(IrcShortcutCommand.makeTrueCopy(ircShortcutCommand));

					if (ircShortcutCommand.id >= this.highestId) {
						this.highestId = ircShortcutCommand.id + 1;
					}
				}
			});
	}
}
