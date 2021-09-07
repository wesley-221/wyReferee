import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITournamentDialogData } from 'app/components/tournament-management/tournament-overview/tournament-overview.component';

@Component({
	selector: 'app-publish-tournament-dialog',
	templateUrl: './publish-tournament-dialog.component.html',
	styleUrls: ['./publish-tournament-dialog.component.scss']
})
export class PublishTournamentDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: ITournamentDialogData) { }
	ngOnInit(): void { }
}
