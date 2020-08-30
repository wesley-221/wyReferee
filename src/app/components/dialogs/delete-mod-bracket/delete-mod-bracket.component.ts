import { Component, OnInit, Inject } from '@angular/core';
import { DeleteModBracketDialogData } from 'app/components/tournament-management/mappool/mod-bracket/mod-bracket.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-delete-mod-bracket',
	templateUrl: './delete-mod-bracket.component.html',
	styleUrls: ['./delete-mod-bracket.component.scss']
})
export class DeleteModBracketComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteModBracketDialogData) { }
	ngOnInit(): void { }
}
