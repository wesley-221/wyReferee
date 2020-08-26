import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-remove-settings',
	templateUrl: './remove-settings.component.html',
	styleUrls: ['./remove-settings.component.scss']
})
export class RemoveSettingsComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) { }
	ngOnInit(): void {}
}
