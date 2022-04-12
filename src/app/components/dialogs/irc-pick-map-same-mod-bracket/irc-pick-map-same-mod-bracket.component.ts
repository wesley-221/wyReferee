import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IBeatmapModBracketDialogData } from 'app/interfaces/i-beatmap-mod-bracket-dialog-data';
import { ElectronService } from 'app/services/electron.service';

@Component({
	selector: 'app-irc-pick-map-same-mod-bracket',
	templateUrl: './irc-pick-map-same-mod-bracket.component.html',
	styleUrls: ['./irc-pick-map-same-mod-bracket.component.scss']
})
export class IrcPickMapSameModBracketComponent implements OnInit {
	constructor(public electronService: ElectronService, @Inject(MAT_DIALOG_DATA) public data: IBeatmapModBracketDialogData) { }
	ngOnInit(): void { }
}
