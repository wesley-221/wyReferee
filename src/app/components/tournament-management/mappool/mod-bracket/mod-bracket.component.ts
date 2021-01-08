import { Component, OnInit, Input } from '@angular/core';
import { ModBracket } from '../../../../models/osu-mappool/mod-bracket';
import { ModBracketMap } from '../../../../models/osu-mappool/mod-bracket-map';
import { GetBeatmap } from '../../../../services/osu-api/get-beatmap.service';
import { ElectronService } from '../../../../services/electron.service';
import { Mods } from '../../../../models/osu-models/osu';
import { ToastService } from '../../../../services/toast.service';
import { ToastType } from '../../../../models/toast';
import { Mappool, MappoolType } from '../../../../models/osu-mappool/mappool';
import { ModCategory } from '../../../../models/osu-mappool/mod-category';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModBracketComponent } from 'app/components/dialogs/delete-mod-bracket/delete-mod-bracket.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

export interface DeleteModBracketDialogData {
	modBracket: ModBracket;
}

@Component({
	selector: 'app-mod-bracket',
	templateUrl: './mod-bracket.component.html',
	styleUrls: ['./mod-bracket.component.scss']
})
export class ModBracketComponent implements OnInit {
	@Input() modBracket: ModBracket;
	@Input() withBorder: boolean;
	@Input() withCollapse: boolean;
	@Input() mappool: Mappool;
	@Input() validationForm: FormGroup;

	selectedMods: { index: number, modValue: any }[] = [];
	modBracketIndex = 0;
	beatmapIndex = 0;
	MAX_BRACKETS = 4;

	dialogMessage: string;
	modBracketToRemove: ModBracket;

	synchAllDisabled = false;

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
		{ modName: 'Freemod', modValue: 'freemod' }
	];

	constructor(private getBeatmap: GetBeatmap, public electronService: ElectronService, private toastService: ToastService, private dialog: MatDialog) { }

	ngOnInit() {
		for (const mod in this.modBracket.mods) {
			const modValue = this.modBracket.mods[mod].modValue;
			this.selectedMods.push({ index: this.modBracketIndex + 1, modValue: modValue });
			this.validationForm.addControl(`mod-bracket-mod-index-${this.modBracket.validateIndex}-${this.modBracketIndex + 1}`, new FormControl(modValue, Validators.required));

			this.modBracketIndex++;
		}
	}

	/**
	 * Add a new beatmap to the given bracket
	 * @param bracket the bracket to add the beatmap to
	 */
	addBeatmap(bracket: ModBracket): void {
		const modBracketMap = new ModBracketMap();
		modBracketMap.index = this.beatmapIndex;
		this.beatmapIndex++;

		bracket.addBeatmap(modBracketMap);

		if (this.mappool.mappoolType == MappoolType.AxS) {
			this.validationForm.addControl(`beatmap-modifier-${this.modBracket.validateIndex}-${modBracketMap.index}`, new FormControl('', Validators.required));
		}
	}

	/**
	 * Remove the given beatmap from the given bracket
	 * @param bracket the bracket to remove the beatmap from
	 * @param beatmap the beatmap to remove
	 */
	removeBeatmap(bracket: ModBracket, beatmap: ModBracketMap): void {
		bracket.removeMap(beatmap);

		if (this.mappool.mappoolType == MappoolType.AxS) {
			this.validationForm.removeControl(`beatmap-modifier-${this.modBracket.validateIndex}-${beatmap.index}`);
		}
	}

	/**
	 * Get the data from the given beatmap
	 * @param beatmap the beatmap to synchronize
	 */
	synchronizeBeatmap(beatmap: ModBracketMap): void {
		beatmap.isSynchronizing = true;

		this.getBeatmap.getByBeatmapId(beatmap.beatmapId).subscribe(data => {
			if (data.beatmap_id == null) {
				beatmap.invalid = true;
			}
			else {
				beatmap.beatmapName = data.getBeatmapname();
				beatmap.beatmapUrl = data.getBeatmapUrl();
				beatmap.beatmapsetId = data.beatmapset_id;
				beatmap.beatmapId = data.beatmap_id;
				beatmap.invalid = false;
			}

			beatmap.isSynchronizing = false;
		});
	}

	/**
	 * Synchronize all beatmaps from the bracket
	 * @param modBracket
	 */
	synchronizeAll(modBracket: ModBracket): void {
		this.synchAllDisabled = true;

		for (const beatmap of modBracket.beatmaps) {
			this.synchronizeBeatmap(beatmap);
		}

		setTimeout(() => {
			this.synchAllDisabled = false;
		}, 3000);
	}

	/**
	 * Collapse a bracket
	 * @param bracket the bracket to collapse
	 */
	collapseBracket(bracket: ModBracket): void {
		bracket.collapsed = !bracket.collapsed;
	}

	/**
	 * Add a new mod bracket
	 */
	addNewMod(): void {
		if (this.selectedMods.length + 1 <= this.MAX_BRACKETS) {
			this.selectedMods.push({ index: this.modBracketIndex, modValue: 0 });
			this.validationForm.addControl(`mod-bracket-mod-index-${this.modBracket.validateIndex}-${this.modBracketIndex}`, new FormControl('', Validators.required));

			this.modBracketIndex++;
		}
		else {
			this.toastService.addToast('Maximum amount of mods reached.', ToastType.Warning);
		}
	}

	/**
	 * Change the value of the selected mod
	 * @param modIndex the index of the mod that has been changed
	 * @param modValue the new value of the mod
	 */
	changeMod(modIndex: number, modValue: MatSelectChange): void {
		modValue = modValue.value;

		// Reset the mods
		this.modBracket.mods = [];

		for (const mod in this.selectedMods) {
			if (this.selectedMods[mod].index == modIndex) {
				this.selectedMods[mod].modValue = modValue;
			}
		}

		this.modBracket.mods = this.selectedMods;
	}

	/**
	 * Delete a mod
	 * @param modIndex the index of the mod to delete
	 */
	deleteMod(modIndex: number): void {
		for (const mod in this.selectedMods) {
			if (this.selectedMods[mod].index == modIndex) {
				this.selectedMods.splice(Number(mod), 1);

				this.modBracket.mods = this.selectedMods;
				this.validationForm.removeControl(`mod-bracket-mod-index-${this.modBracket.validateIndex}-${this.modBracketIndex}`);
				return;
			}
		}
	}

	/**
	 * Change the mod category for the given map
	 * @param beatmap
	 * @param event
	 */
	changeModCategory(beatmap: ModBracketMap, event: any): void {
		const modCategory = this.mappool.getModCategoryByName(event.target.value);

		if (modCategory == undefined) {
			beatmap.modCategory = undefined;
		}
		else {
			beatmap.modCategory = ModCategory.makeTrueCopy(this.mappool.getModCategoryByName(event.target.value));
		}
	}

	/**
	 * Change the mod bracket name
	 * @param modBracket
	 * @param event
	 */
	changeModBracketName(modBracket: ModBracket, event: any): void {
		modBracket.bracketName = event.target.value;
	}

	/**
	 * Remove the mod bracket from the mappool
	 * @param modBracket
	 */
	deleteModBracket(modBracket: ModBracket): void {
		const dialogRef = this.dialog.open(DeleteModBracketComponent, {
			data: {
				modBracket
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.validationForm.removeControl(`mod-bracket-name-${modBracket.id}`);

				for (const mod in this.selectedMods) {
					this.validationForm.removeControl(`mod-bracket-mod-index-${this.modBracket.validateIndex}-${this.selectedMods[mod]}`);
				}

				for (const beatmap in this.modBracket.beatmaps) {
					this.validationForm.removeControl(`beatmap-modifier-${this.modBracket.validateIndex}-${this.modBracket.beatmaps[beatmap].index}`);
				}

				this.mappool.removeModBracket(modBracket);
				this.toastService.addToast(`Successfully removed "${modBracket.bracketName}" from the mappool.`);
			}
		});
	}

	getValidation(key: string): any {
		return this.validationForm.get(key);
	}
}
