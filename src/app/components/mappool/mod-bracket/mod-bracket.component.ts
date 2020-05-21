import { Component, OnInit, Input } from '@angular/core';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { ModBracketMap } from '../../../models/osu-mappool/mod-bracket-map';
import { GetBeatmap } from '../../../services/osu-api/get-beatmap.service';
import { ElectronService } from '../../../services/electron.service';
import { Mods } from '../../../models/osu-models/osu-api';
import { ToastService } from '../../../services/toast.service';
import { ToastType } from '../../../models/toast';

@Component({
	selector: 'app-mod-bracket',
	templateUrl: './mod-bracket.component.html',
	styleUrls: ['./mod-bracket.component.scss']
})
export class ModBracketComponent implements OnInit {
	@Input() modBracket: ModBracket;
	@Input() withBorder: boolean;
	@Input() withCollapse: boolean;

	selectedMods: { index: number, modValue: any }[] = [];
	modBracketIndex: number = 0;
	MAX_BRACKETS: number = 4;

	availableMods: { modName: string, modValue: any }[] = [
		{ modName: 'Nomod', modValue: Mods.None },
		{ modName: 'Hidden', modValue: Mods.Hidden },
		{ modName: 'Flashlight', modValue: Mods.Flashlight },
		{ modName: 'Hardrock', modValue: Mods.HardRock },
		{ modName: 'Easy', modValue: Mods.Easy },
		{ modName: 'Doubletime', modValue: Mods.DoubleTime },
		{ modName: 'Nightcore', modValue: Mods.Nightcore },
		{ modName: 'Nofail', modValue: Mods.NoFail },
		{ modName: 'Halftime', modValue: Mods.HalfTime },
		{ modName: 'Freemod', modValue: "freemod" }
	];

	constructor(private getBeatmap: GetBeatmap, public electronService: ElectronService, private toastService: ToastService) { }
	ngOnInit() {
		for(let mod in this.modBracket.mods) {
			this.selectedMods.push({ index: this.modBracketIndex + 1, modValue: this.modBracket.mods[mod].modValue });
			this.modBracketIndex ++;
		}
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

	/**
	 * Collapse a bracket
	 * @param bracket the bracket to collapse
	 */
	collapseBracket(bracket: ModBracket) {
		bracket.collapsed = !bracket.collapsed;
	}

	/**
	 * Add a new mod bracket
	 */
	addNewMod() {
		if(this.selectedMods.length + 1 <= this.MAX_BRACKETS) {
			this.selectedMods.push({ index: this.modBracketIndex + 1, modValue: 0 });
			this.modBracketIndex ++;
		}
		else {
			this.toastService.addToast(`Maximum amount of mods reached.`, ToastType.Warning);
		}
	}

	/**
	 * Change the value of the selected mod
	 * @param modIndex the index of the mod that has been changed
	 * @param modValue the new value of the mod
	 */
	changeMod(modIndex: number, modValue: any) {
		modValue = modValue.target.value;

		// Reset the mods
		this.modBracket.mods = [];

		for(let mod in this.selectedMods) {
			if(this.selectedMods[mod].index == modIndex) {
				this.selectedMods[mod].modValue = modValue;
			}
		}

		this.modBracket.mods = this.selectedMods;
	}

	/**
	 * Delete a mod
	 * @param modIndex the index of the mod to delete
	 */
	deleteMod(modIndex: number) {
		for(let mod in this.selectedMods) {
			if(this.selectedMods[mod].index == modIndex) {
				this.selectedMods.splice(Number(mod), 1);

				this.modBracket.mods = this.selectedMods;
				return;
			}
		}
	}
}
