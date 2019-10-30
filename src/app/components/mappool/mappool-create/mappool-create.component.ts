import { Component, OnInit } from '@angular/core';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { MappoolService } from '../../../services/mappool.service';
import { ModBracketMap } from '../../../models/osu-mappool/mod-bracket-map';
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
	gamemodeId: number;

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
	 * Add a new beatmap to the given bracket
	 * @param bracket the bracket to add the beatmap to
	 */
	addBeatmap(bracket: ModBracket) {
		const newBracket = new ModBracketMap();
		newBracket.gamemodeId = this.gamemodeId;

		bracket.addBeatmap(newBracket);
	}

	/**
	 * Remove the given beatmap from the given bracket
	 * @param bracket the bracket to remove the beatmap from
	 * @param beatmap the beatmap to remove
	 */
	removeBeatmap(bracket: ModBracket, beatmap: ModBracketMap) {
		bracket.removeMap(beatmap);
	}

	/**
	 * Get the data from the given beatmap
	 * @param beatmap the beatmap to synchronize
	 */
	synchronizeBeatmap(beatmap: ModBracketMap) {
		this.getBeatmap.getByBeatmapId(beatmap.beatmapId).subscribe(data => {
			if(data.beatmap_id == null) {
				beatmap.invalid = true;
			}
			else {
				beatmap.beatmapName = data.getBeatmapname();
				beatmap.beatmapUrl = data.getBeatmapUrl();
				beatmap.invalid = false;
			}
		});
	}

	/**
	 * Create the mappool from the creationMappool object
	 */
	createMappool() {
		this.creationMappool.publish_id = Mappool.generatePublishToken();
		this.mappoolService.saveMappool(this.creationMappool);
		this.toastService.addToast(`Successfully created the mappool "${this.creationMappool.name}"!`);
	}

	/**
	 * Collapse a bracket
	 * @param bracket the bracket to collapse
	 */
	collapseBracket(bracket: ModBracket) {
		bracket.collapsed = !bracket.collapsed;
	}
}
