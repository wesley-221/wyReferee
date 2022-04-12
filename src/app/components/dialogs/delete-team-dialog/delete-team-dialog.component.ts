import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITeamDialogData } from 'app/interfaces/i-team-dialog-data';

@Component({
	selector: 'app-delete-team-dialog',
	templateUrl: './delete-team-dialog.component.html',
	styleUrls: ['./delete-team-dialog.component.scss']
})
export class DeleteTeamDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: ITeamDialogData) { }
	ngOnInit(): void { }
}
