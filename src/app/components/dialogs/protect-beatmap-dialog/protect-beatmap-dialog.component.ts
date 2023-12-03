import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProtectBeatmapDialogData } from 'app/interfaces/i-protect-beatmap-dialog-data';
import { ElectronService } from 'app/services/electron.service';

@Component({
	selector: 'app-protect-beatmap-dialog',
	templateUrl: './protect-beatmap-dialog.component.html',
	styleUrls: ['./protect-beatmap-dialog.component.scss']
})
export class ProtectBeatmapDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: IProtectBeatmapDialogData, public electronService: ElectronService) { }
	ngOnInit(): void { }

	teamChange(event: MatButtonToggleChange) {
		this.data.protectForTeam = event.value;
	}
}
