import { Component, OnInit } from '@angular/core';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { MappoolService } from '../../../services/mappool.service';
import { GetBeatmap } from '../../../services/osu-api/get-beatmap.service';
import { ElectronService } from '../../../services/electron.service';
import { ToastService } from '../../../services/toast.service';

@Component({
	selector: 'app-mappool-create',
	templateUrl: './mappool-create.component.html',
	styleUrls: ['./mappool-create.component.scss']
})

export class MappoolCreateComponent implements OnInit {
	creationMappool: Mappool;

	constructor(public electronService: ElectronService, private mappoolService: MappoolService, private getBeatmap: GetBeatmap, private toastService: ToastService) {
		this.creationMappool = mappoolService.creationMappool;
		this.creationMappool.id = mappoolService.availableMappoolId;
	}

	ngOnInit() { }

	/**
	 * Create a new bracket
	 */
	createNewBracket() {
		this.creationMappool.addBracket(new ModBracket());
	}

	/**
	 * Create the mappool from the creationMappool object
	 */
	createMappool() {
		this.mappoolService.saveMappool(this.creationMappool);
		this.toastService.addToast(`Successfully created the mappool "${this.creationMappool.name}"!`);
	}

	/**
	 * Change the gamemode of the mappool
	 */
	changeGamemode(event) {
		this.creationMappool.gamemodeId = event.target.value;
	}
}
