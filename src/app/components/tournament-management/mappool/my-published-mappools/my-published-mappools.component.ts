import { Component, OnInit } from '@angular/core';
import { Mappool } from '../../../../models/osu-mappool/mappool';
import { MappoolService } from '../../../../services/mappool.service';
import { AuthenticateService } from '../../../../services/authenticate.service';

@Component({
	selector: 'app-my-published-mappools',
	templateUrl: './my-published-mappools.component.html',
	styleUrls: ['./my-published-mappools.component.scss']
})
export class MyPublishedMappoolsComponent implements OnInit {
	publishedMappools: Mappool[];

	constructor(private mappoolService: MappoolService, private auth: AuthenticateService) {
		this.auth.hasLoggedInUserLoaded().subscribe((hasLoaded: boolean) => {
			if (hasLoaded == true) {
				this.populateMappools();
			}
		});
	}

	ngOnInit(): void { }

	/**
	 * Gets called when a mappool has been deleted
	 * @param deleted
	 */
	public mappoolHasBeenDeleted(deleted: boolean): void {
		if (deleted == true) {
			this.populateMappools();
		}
	}

	/**
	 * Populate the mappool array with your published mappools
	 */
	private populateMappools() {
		this.publishedMappools = [];

		this.mappoolService.getAllPublishedMappoolsFromUser(this.auth.loggedInUser).subscribe(data => {
			for (const mappool in data) {
				const newMappool: Mappool = Mappool.serializeJson(data[mappool]);
				this.publishedMappools.push(newMappool);
			}
		});
	}
}
