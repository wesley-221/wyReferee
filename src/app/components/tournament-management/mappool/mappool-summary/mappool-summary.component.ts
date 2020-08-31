import { Component, OnInit, Input } from '@angular/core';
import { Mappool } from '../../../../models/osu-mappool/mappool';
import { MappoolService } from '../../../../services/mappool.service';
import { ToastService } from '../../../../services/toast.service';
import { AuthenticateService } from '../../../../services/authenticate.service';
import { Router } from '@angular/router';
import { ToastType } from '../../../../models/toast';
import { MatDialog } from '@angular/material/dialog';
import { PublishMappoolComponent } from 'app/components/dialogs/publish-mappool/publish-mappool.component';
import { DeleteMappoolComponent } from 'app/components/dialogs/delete-mappool/delete-mappool.component';

export interface PublishMappoolDialogData {
	mappool: Mappool;
}

export interface DeleteMappoolDialogData {
	mappool: Mappool;
}

@Component({
	selector: 'app-mappool-summary',
	templateUrl: './mappool-summary.component.html',
	styleUrls: ['./mappool-summary.component.scss']
})
export class MappoolSummaryComponent implements OnInit {
	@Input() mappool: Mappool;
	@Input() publish = false;

	dialogMessage: string;
	dialogAction = 0;
	mappoolToModify: Mappool;

	constructor(private mappoolService: MappoolService, private toastService: ToastService, private authService: AuthenticateService, private router: Router, private dialog: MatDialog) { }

	ngOnInit(): void { }

	/**
	 * Update a mappool
	 * @param mappool the mappool to update
	 */
	updateMappool(mappool: Mappool): void {
		this.mappoolService.getPublishedMappool(mappool.publishId).subscribe((data) => {
			const updatedMappool: Mappool = Mappool.serializeJson(data);
			updatedMappool.publishId = mappool.publishId;
			updatedMappool.updateAvailable = false;

			this.mappoolService.replaceMappool(mappool, updatedMappool);

			this.toastService.addToast(`Successfully updated the mappool "${mappool.name}"!`, ToastType.Information);
		});
	}

	/**
	 * Publish a mappool
	 * @param mappool the mappool to publish
	 */
	publishMappool(mappool: Mappool): void {
		const dialogRef = this.dialog.open(PublishMappoolComponent, {
			data: {
				mappool: mappool
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				const publishMappool: Mappool = Mappool.makeTrueCopy(mappool);

				// Reset id
				publishMappool.id = null;

				// Stringify the mods
				for (const modBracket in publishMappool.modBrackets) {
					// Reset id
					publishMappool.modBrackets[modBracket].id = null;

					(<any>publishMappool.modBrackets[modBracket]).mods = JSON.stringify(publishMappool.modBrackets[modBracket].mods);

					// Reset id's
					for (const modBracketMap in publishMappool.modBrackets[modBracket].beatmaps) {
						publishMappool.modBrackets[modBracket].beatmaps[modBracketMap].id = null;
					}
				}

				this.mappoolService.publishMappool(publishMappool).subscribe((data) => {
					this.toastService.addToast(`Successfully published the mappool "${data.body.name}" with the id ${data.body.id}.`);
				});
			}
		})
	}

	/**
	 * Delete a mappool from the bottom of the earth
	 * @param mappool the mappool
	 */
	deleteMappool(mappool: Mappool): void {
		const dialogRef = this.dialog.open(DeleteMappoolComponent, {
			data: {
				mappool: mappool
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				if (this.publish == true) {
					this.mappoolService.deletePublishedMappool(mappool).subscribe(() => {
						this.toastService.addToast(`Successfully deleted the published mappool "${mappool.name}".`);
					}, (err) => {
						console.log(err);
					});
				}
				else {
					this.mappoolService.deleteMappool(mappool);
					this.toastService.addToast(`Successfully deleted the mappool "${mappool.name}".`);
				}
			}
		});
	}

	/**
	 * Check if the user has sufficient permissions to publish the mappool
	 */
	canPublish(): boolean {
		return this.authService.loggedIn && ((<any>this.authService.loggedInUser.isTournamentHost) == 'true' || this.authService.loggedInUser.isTournamentHost == true || this.authService.loggedInUser.isAdmin);
	}

	/**
	 * Edit a mappool
	 * @param mappool the mappool to edit
	 */
	editMappool(mappool: Mappool, event: any): void {
		// Check if click wasn't on a button
		if (event.srcElement.className.search(/mat-icon|mat-mini-fab|mat-button-wrapper/) == -1) {
			this.router.navigate(['/tournament-management/mappool-overview/mappool-edit', mappool.id, this.publish]);
		}
	}
}
