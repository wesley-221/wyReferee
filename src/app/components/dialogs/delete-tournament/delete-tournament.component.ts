import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteTournamentDialogData } from 'app/components/tournament-management/tournament/tournament-summary/tournament-summary.component';

@Component({
	selector: 'app-delete-tournament',
	templateUrl: './delete-tournament.component.html',
	styleUrls: ['./delete-tournament.component.scss']
})
export class DeleteTournamentComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteTournamentDialogData) { }
	ngOnInit(): void { }
}
