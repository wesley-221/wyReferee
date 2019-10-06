import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { MultiplayerLobby } from '../../models/multiplayer-lobby';
import { MultiplayerLobbiesService } from '../../services/multiplayer-lobbies.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-all-lobbies',
	templateUrl: './all-lobbies.component.html',
	styleUrls: ['./all-lobbies.component.scss']
})

export class AllLobbiesComponent implements OnInit {
	allLobbies: MultiplayerLobby[];

	constructor(private storeService: StoreService, private multiplayerLobbies: MultiplayerLobbiesService, private toastService: ToastService, private router: Router) { 
		this.allLobbies = multiplayerLobbies.getAllLobbies();
	}

	ngOnInit() { }

	deleteLobby(multiplayerLobby: MultiplayerLobby) {		
		if(confirm(`Are you sure you want to delete the multiplayer lobby "${multiplayerLobby.description}"?`)) {
			this.multiplayerLobbies.remove(multiplayerLobby);
		
			this.toastService.addToast(`Successfully deleted the multiplayer lobby "${multiplayerLobby.description}".`);
		}
	}

	openLobby(multiplayerLobby: MultiplayerLobby) {
		this.router.navigate(['lobby-view', multiplayerLobby.lobbyId]);
	}
}
