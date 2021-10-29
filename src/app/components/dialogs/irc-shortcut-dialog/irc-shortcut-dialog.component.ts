import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IrcShortcutCommand } from 'app/models/irc-shortcut-command';
import { IrcShortcutCommandsService } from 'app/services/irc-shortcut-commands.service';

@Component({
	selector: 'app-irc-shortcut-dialog',
	templateUrl: './irc-shortcut-dialog.component.html',
	styleUrls: ['./irc-shortcut-dialog.component.scss']
})
export class IrcShortcutDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: string, public ircShortCutCommandsService: IrcShortcutCommandsService) { }
	ngOnInit(): void { }

	createNewShortcutCommand(): void {
		this.ircShortCutCommandsService.ircShortCutCommands.push(new IrcShortcutCommand());
	}

	saveIrcShortcutCommands(): IrcShortcutCommand[] {
		return this.ircShortCutCommandsService.ircShortCutCommands;
	}

	deleteIrcShortcutCommand(ircShortcutCommand: IrcShortcutCommand): void {
		this.ircShortCutCommandsService.removeIrcShortcutCommand(ircShortcutCommand.label);
	}

	createGenericShortcutCommands(): void {
		this.ircShortCutCommandsService.addIrcShortcutCommand('start', '!mp start 10');
		this.ircShortCutCommandsService.addIrcShortcutCommand('aborttimer', '!mp aborttimer');
		this.ircShortCutCommandsService.addIrcShortcutCommand('settings', '!mp settings');
		this.ircShortCutCommandsService.addIrcShortcutCommand('team slots', '{{ team1 }} has slot {{ team1slots }} - team {{ team1colour }} // {{ team2 }} has slot {{ team2slots}} - team {{ team2colour }}');
		this.ircShortCutCommandsService.addIrcShortcutCommand('close', '!mp close');

		this.ircShortCutCommandsService.saveIrcShortcutCommands();
	}
}
