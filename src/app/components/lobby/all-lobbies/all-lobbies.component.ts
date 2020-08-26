import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { MultiplayerLobby } from '../../../models/store-multiplayer/multiplayer-lobby';
import { MultiplayerLobbiesService } from '../../../services/multiplayer-lobbies.service';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';
import { ElectronService } from '../../../services/electron.service';
declare let $: any;

@Component({
	selector: 'app-all-lobbies',
	templateUrl: './all-lobbies.component.html',
	styleUrls: ['./all-lobbies.component.scss']
})

export class AllLobbiesComponent implements OnInit {
	allLobbies: MultiplayerLobby[];

	dialogMessage: string;
	deleteMultiplayerLobby: MultiplayerLobby;

	constructor(private storeService: StoreService, private multiplayerLobbies: MultiplayerLobbiesService, private toastService: ToastService, private router: Router, private electronService: ElectronService) {
		this.allLobbies = multiplayerLobbies.getAllLobbies();
	}

	ngOnInit() { }

	openDialog(multiplayerLobby: MultiplayerLobby) {
		this.dialogMessage = `Are you sure you want to delete the multiplayer lobby "${multiplayerLobby.description}"? <br><br><b>NOTE:</b> This action is permanent. Once the lobby has been deleted, this can not be retrieved anymore.`;
		this.deleteMultiplayerLobby = multiplayerLobby;

		$('#dialog').modal('toggle');
	}

	deleteLobby(multiplayerLobby: MultiplayerLobby) {
		this.multiplayerLobbies.remove(multiplayerLobby);
		this.toastService.addToast(`Successfully deleted the multiplayer lobby "${multiplayerLobby.description}".`);

		$('#dialog').modal('toggle');
	}

	openLobby(multiplayerLobby: MultiplayerLobby, event: any) {
		if (event.srcElement.type != 'button') {
			this.router.navigate(['lobby-view', multiplayerLobby.lobbyId]);
		}
	}
}
