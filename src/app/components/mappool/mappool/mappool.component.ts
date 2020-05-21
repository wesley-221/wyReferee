import { Component, OnInit, Input } from '@angular/core';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { MappoolService } from '../../../services/mappool.service';
import { ToastService } from '../../../services/toast.service';
import { AuthenticateService } from '../../../services/authenticate.service';
import { Router } from '@angular/router';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { ToastType } from '../../../models/toast';

@Component({
	selector: 'app-mappool',
	templateUrl: './mappool.component.html',
	styleUrls: ['./mappool.component.scss']
})
export class MappoolComponent implements OnInit {
	@Input() mappool: Mappool;
	@Input() publish: boolean = false;

	constructor(private mappoolService: MappoolService, private toastService: ToastService, private authService: AuthenticateService, private router: Router) {	}

	ngOnInit(): void { }

	/**
	 * Update a mappool
	 * @param mappool the mappool to update
	 */
	updateMappool(mappool: Mappool) {
		this.mappoolService.getPublishedMappool(mappool.publishId).subscribe((data) => {
			const updatedMappool: Mappool = this.mappoolService.mapFromJson(data);
			updatedMappool.id = mappool.id;
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
		// Stringify the mods
		for(let modBracket in mappool.modBrackets) {
			(<any>mappool.modBrackets[modBracket]).mods = JSON.stringify(mappool.modBrackets[modBracket].mods);
		}

		if(confirm(`Are you sure you want to publish "${mappool.name}"?`)) {
			this.mappoolService.publishMappool(mappool).subscribe((data) => {
				this.toastService.addToast(`Successfully published the mappool "${data.body.name}" with the id ${data.body.id}.`);
			});
		}
	}

	/**
	 * Delete a mappool from the bottom of the earth
	 * @param mappool the mappool
	 */
	deleteMappool(mappool: Mappool) {
		if(this.publish == true) {
			if(confirm(`Are you sure you want to delete "${mappool.name}"? \nNOTE: No one will be able to import it any longer if you continue.`)) {
				this.mappoolService.deletePublishedMappool(mappool).subscribe(() => {
					this.toastService.addToast(`Successfully deleted the published mappool "${mappool.name}".`);
				}, (err) => {
					console.log(err);
				});
			}
		}
		else {
			if(confirm(`Are you sure you want to delete "${mappool.name}"?`)) {
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
	 * Navigate to the edit page
	 * @param mappool the mappool to navigate to
	 * @param bracket the bracket to navigate to
	 */
	editBracket(mappool: Mappool, bracket: ModBracket) {
		this.router.navigate(['edit-bracket', mappool.id, bracket.id, this.publish]);
	}
}
