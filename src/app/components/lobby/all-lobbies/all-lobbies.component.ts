import { Component, OnInit } from '@angular/core';
import { MultiplayerLobby } from '../../../models/store-multiplayer/multiplayer-lobby';
import { MultiplayerLobbiesService } from '../../../services/multiplayer-lobbies.service';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteLobbyComponent } from 'app/components/dialogs/delete-lobby/delete-lobby.component';

export interface MultiplayerLobbyDeleteDialogData {
	multiplayerLobby: MultiplayerLobby;
}

@Component({
	selector: 'app-all-lobbies',
	templateUrl: './all-lobbies.component.html',
	styleUrls: ['./all-lobbies.component.scss']
})

export class AllLobbiesComponent implements OnInit {
	allLobbies: MultiplayerLobby[];

	dialogMessage: string;
	deleteMultiplayerLobby: MultiplayerLobby;

	constructor(private dialog: MatDialog, private multiplayerLobbies: MultiplayerLobbiesService, private toastService: ToastService, private router: Router) {
		this.allLobbies = multiplayerLobbies.getAllLobbies();
	}

	ngOnInit() { }

	/**
	 * Delete a multiplayer lobby
	 * @param multiplayerLobby
	 */
	deleteLobby(multiplayerLobby: MultiplayerLobby) {
		const dialogRef = this.dialog.open(DeleteLobbyComponent, {
			data: {
				multiplayerLobby: multiplayerLobby
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.multiplayerLobbies.remove(multiplayerLobby);
				this.toastService.addToast(`Successfully deleted the multiplayer lobby "${multiplayerLobby.description}".`);
			}
		});
	}

	/**
	 * Navigate to the selected multiplayer lobby
	 * @param multiplayerLobby
	 * @param event
	 */
	navigateLobby(multiplayerLobby: MultiplayerLobby, event: any) {
		if (event.srcElement.className.search(/mat-icon|mat-mini-fab|mat-button-wrapper/) == -1) {
			this.router.navigate(['lobby-overview/lobby-view', multiplayerLobby.lobbyId]);
		}
	}
}
