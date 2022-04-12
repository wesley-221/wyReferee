import { IrcShortcutCommand } from 'app/models/irc-shortcut-command';
import { Lobby } from 'app/models/lobby';

export interface IIrcShortcutCommandDialogData {
	ircShortcutCommand: IrcShortcutCommand;
	lobby: Lobby;
}
