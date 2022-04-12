import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../../services/toast.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteLobbyComponent } from 'app/components/dialogs/delete-lobby/delete-lobby.component';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';
import { Lobby } from 'app/models/lobby';

@Component({
	selector: 'app-all-lobbies',
	templateUrl: './all-lobbies.component.html',
	styleUrls: ['./all-lobbies.component.scss']
})

export class AllLobbiesComponent implements OnInit {
	allLobbies: Lobby[];

	dialogMessage: string;
	deleteMultiplayerLobby: Lobby;

	constructor(private dialog: MatDialog, private multiplayerLobbies: WyMultiplayerLobbiesService, private toastService: ToastService, private router: Router) {
		this.allLobbies = multiplayerLobbies.getAllLobbies();
	}

	ngOnInit() { }

	/**
	 * Delete a multiplayer lobby
	 *
	 * @param multiplayerLobby
	 */
	deleteLobby(multiplayerLobby: Lobby) {
		const dialogRef = this.dialog.open(DeleteLobbyComponent, {
			data: {
				multiplayerLobby: multiplayerLobby
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.multiplayerLobbies.deleteMultiplayerLobby(multiplayerLobby);
				this.toastService.addToast(`Successfully deleted the multiplayer lobby "${multiplayerLobby.description}".`);
			}
		});
	}

	/**
	 * Navigate to the selected multiplayer lobby
	 *
	 * @param multiplayerLobby
	 * @param event
	 */
	navigateLobby(multiplayerLobby: Lobby, event: any) {
		if (event.srcElement.className.search(/mat-icon|mat-mini-fab|mat-button-wrapper/) == -1) {
			this.router.navigate(['lobby-overview/lobby-view', multiplayerLobby.lobbyId]);
		}
	}
}
