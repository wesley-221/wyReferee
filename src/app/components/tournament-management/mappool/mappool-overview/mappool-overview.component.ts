import { Component, OnInit } from '@angular/core';
import { MappoolService } from '../../../../services/mappool.service';
import { Mappool } from '../../../../models/osu-mappool/mappool';
import { ToastService } from '../../../../services/toast.service';
import { AuthenticateService } from '../../../../services/authenticate.service';
import { ToastType } from '../../../../models/toast';

@Component({
	selector: 'app-mappool-overview',
	templateUrl: './mappool-overview.component.html',
	styleUrls: ['./mappool-overview.component.scss']
})

export class MappoolOverviewComponent implements OnInit {
	mappoolId: number;

	constructor(public mappoolService: MappoolService, private toastService: ToastService, public authService: AuthenticateService) { }
	ngOnInit() { }

	/**
	 * Check if the user has sufficient permissions to publish the mappool
	 */
	canPublish() {
		return this.authService.loggedIn && ((<any>this.authService.loggedInUser.isTournamentHost) == 'true' || this.authService.loggedInUser.isTournamentHost == true || this.authService.loggedInUser.isAdmin);
	}

	/**
	 * Import a mappool from the entered mappool id
	 */
	importMappool() {
		this.mappoolService.getPublishedMappool(this.mappoolId).subscribe((data) => {
			const newMappool: Mappool = Mappool.serializeJson(data);
			newMappool.publishId = newMappool.id;
			newMappool.id = this.mappoolService.availableMappoolId;
			this.mappoolService.availableMappoolId++;

			this.mappoolService.saveMappool(newMappool);
			this.toastService.addToast(`Imported the mappool "${newMappool.name}".`);
		}, () => {
			this.toastService.addToast(`Unable to import the mappool with the id "${this.mappoolId}".`, ToastType.Error);
		});
	}
}
