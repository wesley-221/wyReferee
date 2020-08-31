import { Component, OnInit, Inject } from '@angular/core';
import { DeleteMappoolDialogData } from 'app/components/tournament-management/mappool/mappool-summary/mappool-summary.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-delete-mappool',
	templateUrl: './delete-mappool.component.html',
	styleUrls: ['./delete-mappool.component.scss']
})
export class DeleteMappoolComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteMappoolDialogData) { }
	ngOnInit(): void { }
}
