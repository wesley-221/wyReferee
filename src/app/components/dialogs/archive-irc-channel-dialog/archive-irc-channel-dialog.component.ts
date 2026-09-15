import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IrcChannel } from '../../../models/irc/irc-channel';

@Component({
	selector: 'app-archive-irc-channel-dialog',
	templateUrl: './archive-irc-channel-dialog.component.html',
	styleUrl: './archive-irc-channel-dialog.component.scss'
})
export class ArchiveIrcChannelDialogComponent {
	rememberChoice = false;

	constructor(@Inject(MAT_DIALOG_DATA) public channel: IrcChannel, private dialog: MatDialogRef<ArchiveIrcChannelDialogComponent>) { }

	closeDialog(result: boolean | null) {
		this.dialog.close({ result, rememberChoice: this.rememberChoice });
	}
}
