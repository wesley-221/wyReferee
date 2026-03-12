import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../../services/toast.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteLobbyComponent } from 'app/components/dialogs/delete-lobby/delete-lobby.component';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';
import { Lobby } from 'app/models/lobby';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DeleteLobbiesDialogComponent } from 'app/components/dialogs/delete-lobbies-dialog/delete-lobbies-dialog.component';

@Component({
	selector: 'app-all-lobbies',
	templateUrl: './all-lobbies.component.html',
	styleUrls: ['./all-lobbies.component.scss']
})

export class AllLobbiesComponent implements OnInit {
	allLobbies: Lobby[];

	dialogMessage: string;
	deleteMultiplayerLobby: Lobby;

	allSelected: boolean;
	someSelected: boolean;

	selectedCount: number;

	constructor(private dialog: MatDialog, private multiplayerLobbies: WyMultiplayerLobbiesService, private toastService: ToastService, private router: Router) {
		this.allLobbies = multiplayerLobbies.getAllLobbies();

		this.allSelected = false;
		this.someSelected = false;
		this.selectedCount = 0;
	}

	ngOnInit() { }

	/**
	 * Toggle the selection of all lobbies for deletion
	 *
	 * @param toggle
	 */
	toggleAllLobbies(toggle: MatCheckboxChange) {
		if (toggle.checked == true) {
			for (const lobby of this.allLobbies) {
				lobby.checkboxDelete = true;
			}
		}
		else {
			for (const lobby of this.allLobbies) {
				lobby.checkboxDelete = false;
			}
		}

		this.someSelected = false;
		this.allSelected = toggle.checked;
		this.selectedCount = toggle.checked ? this.allLobbies.length : 0;
	}

	/**
	 * Triggered when an individual lobby's checkbox is toggled. Updates the state of the "Select all" checkbox and the count of selected lobbies
	 */
	toggleIndividualLobby() {
		this.selectedCount = 0;

		for (const lobby of this.allLobbies) {
			if (lobby.checkboxDelete) {
				this.selectedCount++;
			}
		}

		this.allSelected = this.selectedCount === this.allLobbies.length;
		this.someSelected = this.selectedCount > 0 && !this.allSelected;
	}

	/**
	 * Delete all selected multiplayer lobbies
	 */
	deleteSelectedLobbies() {
		const dialogRef = this.dialog.open(DeleteLobbiesDialogComponent, {
			data: {
				multiplayerLobbies: this.allLobbies.filter(lobby => lobby.checkboxDelete)
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result == true) {
				const lobbiesToDelete = this.allLobbies.filter(lobby => lobby.checkboxDelete);

				for (const lobby of lobbiesToDelete) {
					this.multiplayerLobbies.deleteMultiplayerLobby(lobby);
				}

				this.toastService.addToast(`Successfully deleted ${lobbiesToDelete.length} multiplayer lobb${lobbiesToDelete.length > 1 ? 'ies' : 'y'}.`);

				this.allSelected = false;
				this.someSelected = false;
				this.selectedCount = 0;
			}
		});
	}

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
	 */
	navigateLobby(multiplayerLobby: Lobby) {
		this.router.navigate(['lobby-overview/lobby-view', multiplayerLobby.lobbyId]);
	}
}
