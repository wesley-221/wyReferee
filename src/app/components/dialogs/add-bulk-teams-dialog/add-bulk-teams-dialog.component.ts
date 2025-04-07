import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-add-bulk-teams-dialog',
	templateUrl: './add-bulk-teams-dialog.component.html',
	styleUrls: ['./add-bulk-teams-dialog.component.scss']
})
export class AddBulkTeamsDialogComponent implements OnInit {
	bulkTeams: string;

	constructor() {
		this.bulkTeams = '';

		// Test data, uncomment to use
		// this.bulkTeams = 'Team 1, Player 1, 1234567, Player 2, 7654321\n' +
		// 	'Team 2, Player 3, 1234567, Player 2, 7654321, Player 3, 1726354\n' +
		// 	'Team 3, Player 5, 1234567, Player 6, 7654321\n' +
		// 	'Team 3, Player 4, 1234567\n' +
		// 	'Team 4\n' +
		// 	'Team 5, Player 7, , Player 8, ';
	}

	ngOnInit(): void { }
}
