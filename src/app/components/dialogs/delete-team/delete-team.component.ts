import { Component, OnInit, Inject } from '@angular/core';
import { DeleteTeamDialogData } from 'app/components/tournament-management/tournament/team/team.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-team',
  templateUrl: './delete-team.component.html',
  styleUrls: ['./delete-team.component.scss']
})
export class DeleteTeamComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteTeamDialogData) { }
	ngOnInit(): void { }
}
