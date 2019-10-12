import { Component, OnInit } from '@angular/core';
import { MappoolService } from '../../../services/mappool.service';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { Router } from '@angular/router';

@Component({
	selector: 'app-mappool-overview',
	templateUrl: './mappool-overview.component.html',
	styleUrls: ['./mappool-overview.component.scss']
})

export class MappoolOverviewComponent implements OnInit {
	constructor(public mappoolService: MappoolService, private router: Router) { }
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
}
