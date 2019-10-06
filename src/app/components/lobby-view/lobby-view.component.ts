import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MultiplayerLobby } from '../../models/multiplayer-lobby';
import { MultiplayerLobbiesService } from '../../services/multiplayer-lobbies.service';

@Component({
	selector: 'app-lobby-view',
	templateUrl: './lobby-view.component.html',
	styleUrls: ['./lobby-view.component.scss']
})

export class LobbyViewComponent implements OnInit {
	selectedLobby: MultiplayerLobby;

	teamOneScore = 8;
	teamTwoScore = 5;

	constructor(private route: ActivatedRoute, private multiplayerLobbies: MultiplayerLobbiesService) {
		this.route.params.subscribe(params => {
			this.selectedLobby = multiplayerLobbies.get(params.id);
		});
	}

	ngOnInit() { }
}
