import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IIrcShortcutCommandDialogData } from 'app/components/irc/irc.component';

@Component({
	selector: 'app-irc-shortcut-warning-dialog',
	templateUrl: './irc-shortcut-warning-dialog.component.html',
	styleUrls: ['./irc-shortcut-warning-dialog.component.scss']
})
export class IrcShortcutWarningDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: IIrcShortcutCommandDialogData) { }
	ngOnInit(): void { }
}
