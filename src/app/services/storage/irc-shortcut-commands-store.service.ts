import { Injectable } from '@angular/core';
import { IrcShortcutCommand } from 'app/models/irc-shortcut-command';
import { BehaviorSubject } from 'rxjs';
import { StorageDriverService } from './storage-driver.service';

interface IrcShortcutCommandsStore {
	[ircShortcutCommandId: number]: IrcShortcutCommand;
}

@Injectable({
	providedIn: 'root'
})
export class IrcShortcutCommandsStoreService {
	private ircShortcutCommands$ = new BehaviorSubject<IrcShortcutCommandsStore | null>(null);

	constructor(private storage: StorageDriverService) {
		this.loadIrcShortcutCommands();
	}

	/**
	 * Saves all IrcShortcutCommands to the storage
	 *
	 * @param ircShortcutCommands the list of IrcShortcutCommands to save
	 */
	async saveAllShortcutCommands(ircShortcutCommands: IrcShortcutCommand[]) {
		const current = this.ircShortcutCommands$.value;

		if (!current) throw new Error('IrcShortcutCommands store not initialized');

		const newIrcShortcutCommands: IrcShortcutCommandsStore = {};

		ircShortcutCommands.forEach(command => {
			newIrcShortcutCommands[command.id] = command;
		});

		this.ircShortcutCommands$.next(newIrcShortcutCommands);
		this.storage.writeJSON(this.storage.ircShortcutCommandsFilePath, newIrcShortcutCommands);
	}

	/**
	 * Saves a single IrcShortcutCommand to the storage
	 *
	 * @param command the IrcShortcutCommand to save
	 */
	async saveIrcShortcutCommand(command: IrcShortcutCommand) {
		const current = this.ircShortcutCommands$.value;

		if (!current) throw new Error('IrcShortcutCommands store not initialized');

		const newIrcShortcutCommands = { ...current, [command.id]: command };
		this.ircShortcutCommands$.next(newIrcShortcutCommands);

		this.storage.writeJSON(this.storage.ircShortcutCommandsFilePath, newIrcShortcutCommands);
	}

	/**
	 * Deletes a single IrcShortcutCommand from the storage
	 * @param command the IrcShortcutCommand to delete
	 */
	async deleteIrcShortcutCommand(command: IrcShortcutCommand) {
		const current = this.ircShortcutCommands$.value;

		if (!current) throw new Error('IrcShortcutCommands store not initialized');

		const { [command.id]: _, ...newIrcShortcutCommands } = current;
		this.ircShortcutCommands$.next(newIrcShortcutCommands);

		this.storage.writeJSON(this.storage.ircShortcutCommandsFilePath, newIrcShortcutCommands);
	}

	/**
	 * Returns an observable that emits all IrcShortcutCommands
	 */
	watchIrcShortcutCommands() {
		return this.ircShortcutCommands$.asObservable();
	}

	/**
	 * Loads all IrcShortcutCommands from storage and initializes the BehaviorSubject
	 */
	private async loadIrcShortcutCommands() {
		const loadedIrcShortcutCommands = await this.storage.readJSON<IrcShortcutCommandsStore>(this.storage.ircShortcutCommandsFilePath, {});
		const ircShortcutCommands = { ...loadedIrcShortcutCommands };

		this.ircShortcutCommands$.next(ircShortcutCommands);
	}
}
