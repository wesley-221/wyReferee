import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { MappoolService } from '../../../services/mappool.service';
import { ToastService } from '../../../services/toast.service';
import { ModBracketMap } from '../../../models/osu-mappool/mod-bracket-map';
import { GetBeatmap } from '../../../services/osu-api/get-beatmap.service';
import { ElectronService } from '../../../services/electron.service';

@Component({
	selector: 'app-mappool-bracket-edit',
	templateUrl: './mappool-bracket-edit.component.html',
	styleUrls: ['./mappool-bracket-edit.component.scss']
})

export class MappoolBracketEditComponent implements OnInit {
	selectedMappool: Mappool;
	selectedBracket: ModBracket;

	mappoolId: number;
	bracketId: number;

	constructor(private route: ActivatedRoute, private mappoolService: MappoolService, private toastService: ToastService, private getBeatmap: GetBeatmap, public electronService: ElectronService) {
		this.route.params.subscribe(params => {
			this.selectedMappool = Mappool.makeTrueCopy(mappoolService.getMappool(params.mappoolId));
			this.selectedBracket = ModBracket.makeTrueCopy(this.selectedMappool.modBrackets[params.bracketId]);

			this.mappoolId = params.mappoolId;
			this.bracketId = params.bracketId;
		});
	}

	ngOnInit() { }

	/**
	 * Save the bracket to the mappool
	 * @param bracket the bracket to save
	 */
	saveBracket(bracket: ModBracket) {
		this.selectedMappool.modBrackets[bracket.id] = bracket;
		this.mappoolService.updateMappool(this.selectedMappool);

		this.toastService.addToast(`Successfully updated the bracket "${bracket.bracketName}" from the mappool "${this.selectedMappool.name}".`);
	}

	/**
	 * Add a new beatmap to the given bracket
	 * @param bracket the bracket to add the beatmap to
	 */
	addBeatmap(bracket: ModBracket) {
		bracket.addBeatmap(new ModBracketMap());
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
}
