import { Component, OnInit, Inject } from '@angular/core';
import { PublishTournamentDialogData } from 'app/components/tournament-management/tournament/tournament-summary/tournament-summary.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-publish-tournament',
	templateUrl: './publish-tournament.component.html',
	styleUrls: ['./publish-tournament.component.scss']
})
export class PublishTournamentComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: PublishTournamentDialogData) { }
	ngOnInit(): void { }
}
