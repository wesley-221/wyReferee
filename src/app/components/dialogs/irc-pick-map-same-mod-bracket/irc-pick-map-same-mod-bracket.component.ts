import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeatmapModBracketDialogData } from 'app/components/irc/irc.component';
import { ElectronService } from 'app/services/electron.service';

@Component({
	selector: 'app-irc-pick-map-same-mod-bracket',
	templateUrl: './irc-pick-map-same-mod-bracket.component.html',
	styleUrls: ['./irc-pick-map-same-mod-bracket.component.scss']
})
export class IrcPickMapSameModBracketComponent implements OnInit {
	constructor(public electronService: ElectronService, @Inject(MAT_DIALOG_DATA) public data: BeatmapModBracketDialogData) { }
	ngOnInit(): void { }
}
