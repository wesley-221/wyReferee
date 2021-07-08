import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITournamentDialogData } from 'app/components/tournament-management/tournament-overview/tournament-overview.component';

@Component({
	selector: 'app-delete-tournament-dialog',
	templateUrl: './delete-tournament-dialog.component.html',
	styleUrls: ['./delete-tournament-dialog.component.scss']
})
export class DeleteTournamentDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: ITournamentDialogData) { }
	ngOnInit(): void { }
}
