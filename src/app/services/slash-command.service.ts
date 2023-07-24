import { Injectable } from '@angular/core';
import { IrcChannel } from 'app/models/irc/irc-channel';
import { Lobby } from 'app/models/lobby';
import { SlashCommand } from 'app/models/slash-command';
import { ElectronService } from './electron.service';
import { ToastService } from './toast.service';
import { ToastType } from 'app/models/toast';

@Injectable({
	providedIn: 'root'
})
export class SlashCommandService {
	slashCommands: Map<string, SlashCommand>;

	constructor(private electronService: ElectronService, private toastService: ToastService) {
		this.slashCommands = new Map();
	}

	/**
	 * Get all slash commands
	 */
	getSlashCommands(): SlashCommand[] {
		return Array.from(this.slashCommands.values());
	}

	/**
	 * Get the slash command
	 *
	 * @param commandName the slash command to get
	 */
	getSlashCommand(commandName: string): SlashCommand {
		return this.slashCommands.get(commandName);
	}

	/**
	 * Register a new slash command
	 *
	 * @param command the slash command to register
	 */
	registerCommand(command: SlashCommand): void {
		if (this.slashCommands.has(command.name)) {
			console.warn(`The slash command ${command.name} already exists.`);
			return;
		}

		this.slashCommands.set(command.name, command);
	}

	/**
	 * Execute a slash command
	 *
	 * @param commandName the slash command to execute
	 */
	executeCommand(commandName: string): void {
		const slashCommand = this.slashCommands.get(commandName);

		if (slashCommand) {
			slashCommand.execute();
		}
	}

	/**
	 * Make a log file for the given irc channel
	 *
	 * @param ircChannel the irc channel to make a log file for
	 */
	saveLog(ircChannel: IrcChannel) {
		const allMessages: string[] = [];

		for (const message of ircChannel.messages) {
			if (!message.isADivider) {
				allMessages.push(`${message.time} ${message.author}: ${message.getRawMessage()}`);
			}
		}

		this.electronService.dialog.showSaveDialog({
			title: `Save the log of ${ircChannel.name}`,
			defaultPath: `${ircChannel.name}.txt`
		}).then(file => {
			this.electronService.fs.writeFile(file.filePath, allMessages.join('\n'), err => {
				if (err) {
					this.toastService.addToast(`Could not save the log file: ${err.message}.`, ToastType.Error);
				}
				else {
					this.toastService.addToast(`Successfully saved the log file to "${file.filePath}".`);
				}
			});
		});
	}

	/**
	 * Make a log file of various debug data
	 *
	 * @param multiplayerLobby
	 * @param ircChannel
	 */
	saveDebug(multiplayerLobby: Lobby, ircChannel: IrcChannel) {
		const data = {
			lobby: multiplayerLobby,
			irc: ircChannel
		};

		this.electronService.dialog.showSaveDialog({
			title: `Save the debug file`,
			defaultPath: `debug_${multiplayerLobby.getLobbyNameSlug()}.json`
		}).then(file => {
			this.electronService.fs.writeFile(file.filePath, JSON.stringify(data, null, '\t'), err => {
				if (err) {
					this.toastService.addToast(`Could not save the log file: ${err.message}.`, ToastType.Error);
				}
				else {
					this.toastService.addToast(`Successfully saved the log file to "${file.filePath}".`);
				}
			});
		});
	}
}

