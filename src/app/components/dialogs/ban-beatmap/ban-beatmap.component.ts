import { Component, OnInit, Inject } from '@angular/core';
import { BanBeatmapDialogData } from 'app/components/irc/irc.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElectronService } from 'app/services/electron.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-ban-beatmap',
  templateUrl: './ban-beatmap.component.html',
  styleUrls: ['./ban-beatmap.component.scss']
})
export class BanBeatmapComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: BanBeatmapDialogData, public electronService: ElectronService) { }
	ngOnInit(): void { }

	teamChange(event: MatButtonToggleChange) {
		this.data.banForTeam = event.value;
	}
}
