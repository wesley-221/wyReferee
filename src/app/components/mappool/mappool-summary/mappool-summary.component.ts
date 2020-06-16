import { Component, OnInit, Input } from '@angular/core';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { MappoolService } from '../../../services/mappool.service';
import { ToastService } from '../../../services/toast.service';
import { AuthenticateService } from '../../../services/authenticate.service';
import { Router } from '@angular/router';
import { ToastType } from '../../../models/toast';

@Component({
	selector: 'app-mappool-summary',
	templateUrl: './mappool-summary.component.html',
	styleUrls: ['./mappool-summary.component.scss']
})
export class MappoolSummaryComponent implements OnInit {
	@Input() mappool: Mappool;
	@Input() publish: boolean = false;

	constructor(private mappoolService: MappoolService, private toastService: ToastService, private authService: AuthenticateService, private router: Router) { }

	ngOnInit(): void { }

	/**
	 * Update a mappool
	 * @param mappool the mappool to update
	 */
	updateMappool(mappool: Mappool) {
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
	publishMappool(mappool: Mappool) {
		let publishMappool: Mappool = Mappool.makeTrueCopy(mappool);

		// Reset id
		publishMappool.id = null;

		// Stringify the mods
		for (let modBracket in publishMappool.modBrackets) {
			// Reset id
			publishMappool.modBrackets[modBracket].id = null;

			(<any>publishMappool.modBrackets[modBracket]).mods = JSON.stringify(publishMappool.modBrackets[modBracket].mods);

			// Reset id's
			for (let modBracketMap in publishMappool.modBrackets[modBracket].beatmaps) {
				publishMappool.modBrackets[modBracket].beatmaps[modBracketMap].id = null;
			}
		}

		if (confirm(`Are you sure you want to publish "${mappool.name}"?`)) {
			this.mappoolService.publishMappool(publishMappool).subscribe((data) => {
				this.toastService.addToast(`Successfully published the mappool "${data.body.name}" with the id ${data.body.id}.`);
			});
		}
	}

	/**
	 * Delete a mappool from the bottom of the earth
	 * @param mappool the mappool
	 */
	deleteMappool(mappool: Mappool) {
		if (this.publish == true) {
			if (confirm(`Are you sure you want to delete "${mappool.name}"? \nNOTE: No one will be able to import it any longer if you continue.`)) {
				this.mappoolService.deletePublishedMappool(mappool).subscribe(() => {
					this.toastService.addToast(`Successfully deleted the published mappool "${mappool.name}".`);
				}, (err) => {
					console.log(err);
				});
			}
		}
		else {
			if (confirm(`Are you sure you want to delete "${mappool.name}"?`)) {
				this.mappoolService.deleteMappool(mappool);
			}
		}
	}

	/**
	 * Check if the user has sufficient permissions to publish the mappool
	 */
	canPublish() {
		return this.authService.loggedIn && ((<any>this.authService.loggedInUser.isTournamentHost) == 'true' || this.authService.loggedInUser.isTournamentHost == true || this.authService.loggedInUser.isAdmin);
	}

	/**
	 * Edit a mappool
	 * @param mappool the mappool to edit
	 */
	editMappool(mappool: Mappool, event) {
		// Check if click wasn't on a button
		if (event.srcElement.className.indexOf('btn') == -1) {
			this.router.navigate(['mappool-edit', mappool.id, this.publish]);
		}
	}
}
