import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDeleteModBracketDialogData } from 'app/interfaces/i-delete-mod-bracket-dialog-data';
@Component({
	selector: 'app-delete-mod-bracket-dialog',
	templateUrl: './delete-mod-bracket-dialog.component.html',
	styleUrls: ['./delete-mod-bracket-dialog.component.scss']
})
export class DeleteModBracketDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: IDeleteModBracketDialogData) { }
	ngOnInit(): void { }
}
