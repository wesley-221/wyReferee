import { Component, OnInit } from '@angular/core';
import { MappoolService } from '../../../services/mappool.service';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { AuthenticateService } from '../../../services/authenticate.service';

@Component({
	selector: 'app-mappool-overview',
	templateUrl: './mappool-overview.component.html',
	styleUrls: ['./mappool-overview.component.scss']
})

export class MappoolOverviewComponent implements OnInit {
	mappoolPublishId: string;

	constructor(public mappoolService: MappoolService, private router: Router, private toastService: ToastService, public authService: AuthenticateService) { }
	ngOnInit() { }

	/**
	 * Delete a mappool from the bottom of the earth
	 * @param mappool the mappool
	 */
	deleteMappool(mappool: Mappool) {
		if(confirm(`Are you sure you want to delete "${mappool.name}"?`)) {
			this.mappoolService.deleteMappool(mappool);
		}
	}

	/**
	 * Navigate to the edit page
	 * @param mappool the mappool to navigate to
	 * @param bracket the bracket to navigate to
	 */
	editBracket(mappool: Mappool, bracket: ModBracket) {
		this.router.navigate(['edit-bracket', mappool.id, bracket.id]);
	}

	/**
	 * Publish a mappool to firebase
	 * @param mappool the mappool to publish
	 */
	publishMappool(mappool: Mappool) {
		if(confirm(`Are you sure you want to publish "${mappool.name}"?`)) {
			this.mappoolService.publishMappool(mappool);
			this.toastService.addToast(`Successfully published the mappool "${mappool.name}".`);
		}
	}

	/**
	 * Import a mappool from the entered publish_id
	 */
	importMappool() {
		this.mappoolService.getPublishedMappool(this.mappoolPublishId).subscribe(data => {
			if(data) {
				const newMappool = data;
				newMappool.id = this.mappoolService.availableMappoolId;
	
				this.mappoolService.saveMappool(newMappool);

				this.toastService.addToast(`Imported the mappool "${newMappool.name}".`);
			}
			else {
				this.toastService.addToast(`Unable to import the mappool with the publish id "${this.mappoolPublishId}".`);
			}
		});
	}
}
