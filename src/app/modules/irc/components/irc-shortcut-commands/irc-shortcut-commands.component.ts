import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IrcShortcutDialogComponent } from 'app/components/dialogs/irc-shortcut-dialog/irc-shortcut-dialog.component';
import { IrcShortcutWarningDialogComponent } from 'app/components/dialogs/irc-shortcut-warning-dialog/irc-shortcut-warning-dialog.component';
import { IrcShortcutCommand } from 'app/models/irc-shortcut-command';
import { IrcChannel } from 'app/models/irc/irc-channel';
import { Lobby } from 'app/models/lobby';
import { IrcShortcutCommandsService } from 'app/services/irc-shortcut-commands.service';
import { IrcService } from 'app/services/irc.service';

@Component({
	selector: 'app-irc-shortcut-commands',
	templateUrl: './irc-shortcut-commands.component.html',
	styleUrls: ['./irc-shortcut-commands.component.scss']
})
export class IrcShortcutCommandsComponent implements OnInit {
	@Input() lobby: Lobby;
	@Input() channel: IrcChannel;
	@Output() focusChat: EventEmitter<boolean>;

	constructor(public ircService: IrcService, public ircShortcutCommandsService: IrcShortcutCommandsService, private dialog: MatDialog) {
		this.focusChat = new EventEmitter(false);
	}

	ngOnInit(): void { }

	/**
	 * Open a dialog to manage irc shortcut commands
	 */
	shortcutSettings(): void {
		const dialogRef = this.dialog.open(IrcShortcutDialogComponent);

		dialogRef.afterClosed().subscribe(result => {
			if (result == false) {
				this.ircShortcutCommandsService.loadIrcShortcutCommands();
			}
			else {
				this.ircShortcutCommandsService.saveIrcShortcutCommands();
			}
		});
	}

	/**
	 * Execute an irc shortcut command and process variables
	 *
	 * @param ircShortcutCommand the command that was executed
	 */
	executeIrcShortcutCommand(ircShortcutCommand: IrcShortcutCommand): void {
		if (!this.ircService.isAuthenticated) {
			return;
		}

		if (ircShortcutCommand.warning == true) {
			const dialogRef = this.dialog.open(IrcShortcutWarningDialogComponent, {
				data: {
					ircShortcutCommand: ircShortcutCommand,
					lobby: this.lobby
				}
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result == true) {
					const ircCommand = ircShortcutCommand.parseIrcCommand(this.lobby);
					this.ircService.sendMessage(this.channel.name, ircCommand);

					this.focusChat.emit(true);
				}
			});
		}
		else {
			const ircCommand = ircShortcutCommand.parseIrcCommand(this.lobby);
			this.ircService.sendMessage(this.channel.name, ircCommand);

			this.focusChat.emit(true);
		}
	}
}
