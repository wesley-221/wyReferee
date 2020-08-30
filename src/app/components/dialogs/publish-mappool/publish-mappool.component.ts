import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MultiplayerLobbyDeleteDialogData } from 'app/components/lobby/all-lobbies/all-lobbies.component';
import { PublishMappoolDialogData } from 'app/components/tournament-management/mappool/mappool-summary/mappool-summary.component';

@Component({
	selector: 'app-publish-mappool',
	templateUrl: './publish-mappool.component.html',
	styleUrls: ['./publish-mappool.component.scss']
})
export class PublishMappoolComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: PublishMappoolDialogData) { }
	ngOnInit(): void { }
}
