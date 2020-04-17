import { Component, OnInit, Input } from '@angular/core';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { ModBracketMap } from '../../../models/osu-mappool/mod-bracket-map';
import { GetBeatmap } from '../../../services/osu-api/get-beatmap.service';
import { ElectronService } from '../../../services/electron.service';

@Component({
	selector: 'app-mod-bracket',
	templateUrl: './mod-bracket.component.html',
	styleUrls: ['./mod-bracket.component.scss']
})
export class ModBracketComponent implements OnInit {
	@Input() modBracket: ModBracket;
	@Input() withBorder: boolean;
	@Input() withCollapse: boolean;

	constructor(private getBeatmap: GetBeatmap, public electronService: ElectronService) { }
	ngOnInit() { }

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

	/**
	 * Collapse a bracket
	 * @param bracket the bracket to collapse
	 */
	collapseBracket(bracket: ModBracket) {
		bracket.collapsed = !bracket.collapsed;
	}
}
