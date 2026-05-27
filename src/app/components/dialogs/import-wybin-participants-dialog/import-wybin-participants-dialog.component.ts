import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-import-wybin-participants-dialog',
	templateUrl: './import-wybin-participants-dialog.component.html',
	styleUrl: './import-wybin-participants-dialog.component.scss'
})
export class ImportWybinParticipantsDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: { type: 'players' | 'teams' }) { }
}
