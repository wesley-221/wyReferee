import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMappoolDialogData } from 'app/interfaces/i-mappool-dialog-data';

@Component({
	selector: 'app-delete-mappool-dialog',
	templateUrl: './delete-mappool-dialog.component.html',
	styleUrls: ['./delete-mappool-dialog.component.scss']
})
export class DeleteMappoolDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: IMappoolDialogData) { }
	ngOnInit(): void { }
}
