import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITeamDialogData } from 'app/components/tournament-management/tournament/tournament-participants/tournament-participants.component';

@Component({
	selector: 'app-delete-team-dialog',
	templateUrl: './delete-team-dialog.component.html',
	styleUrls: ['./delete-team-dialog.component.scss']
})
export class DeleteTeamDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: ITeamDialogData) { }
	ngOnInit(): void { }
}
