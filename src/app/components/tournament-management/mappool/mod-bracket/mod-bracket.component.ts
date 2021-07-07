import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModBracketDialogComponent } from 'app/components/dialogs/delete-mod-bracket-dialog/delete-mod-bracket-dialog.component';
import { Mods } from 'app/models/osu-models/osu';
import { ToastType } from 'app/models/toast';
import { MappoolType, WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { WyMod } from 'app/models/wytournament/mappool/wy-mod';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WyModBracketMap } from 'app/models/wytournament/mappool/wy-mod-bracket-map';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ElectronService } from 'app/services/electron.service';
import { GetBeatmap } from 'app/services/osu-api/get-beatmap.service';
import { ToastService } from 'app/services/toast.service';

export interface IDeleteModBracketDialogData {
	modBracket: WyModBracket;
}
@Component({
	selector: 'app-mod-bracket',
	templateUrl: './mod-bracket.component.html',
	styleUrls: ['./mod-bracket.component.scss']
})
export class ModBracketComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() mappool: WyMappool;
	@Input() modBracket: WyModBracket;
	@Input() validationForm: FormGroup;

	availableMods: WyMod[];
	MAX_BRACKETS: number;
	bulkBeatmaps: string;
	synchAllDisabled: boolean;

	constructor(private getBeatmap: GetBeatmap, private dialog: MatDialog, private toastService: ToastService, public electronService: ElectronService) {
		this.availableMods = [
			new WyMod({ name: 'Nomod', value: Mods.None }),
			new WyMod({ name: 'Hidden', value: Mods.Hidden }),
			new WyMod({ name: 'Flashlight', value: Mods.Flashlight }),
			new WyMod({ name: 'Hardrock', value: Mods.HardRock }),
			new WyMod({ name: 'Easy', value: Mods.Easy }),
			new WyMod({ name: 'Doubletime', value: Mods.DoubleTime }),
			new WyMod({ name: 'Nightcore', value: Mods.Nightcore }),
			new WyMod({ name: 'Nofail', value: Mods.NoFail }),
			new WyMod({ name: 'Halftime', value: Mods.HalfTime }),
			new WyMod({ name: 'Freemod', value: 'freemod' })
		];

		this.MAX_BRACKETS = 4;
		this.synchAllDisabled = false;

		// TODO: remove this
		this.bulkBeatmaps = '2775160,2774351,1298998,2374098,183084,2774189,308024,1621362';
	}
	ngOnInit(): void { }

	/**
	 * When the name of the mappool gets changed
	 * @param evt
	 */
	onNameChange(evt: Event) {
		this.modBracket.name = (evt.target as any).value
	}

	/**
	 * Collapse a bracket
	 * @param bracket the bracket to collapse
	 */
	collapseBracket(bracket: WyModBracket): void {
		bracket.collapsed = !bracket.collapsed;
	}

	/**
	 * Remove the mod bracket from the mappool
	 * @param modBracket
	 */
	deleteModBracket(modBracket: WyModBracket): void {
		const dialogRef = this.dialog.open(DeleteModBracketDialogComponent, {
			data: {
				modBracket
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				for (const findModBracket in this.mappool.modBrackets) {
					if (this.mappool.modBrackets[findModBracket].index == modBracket.index) {
						this.mappool.modBrackets.splice(Number(findModBracket), 1);
						break;
					}
				}

				this.validationForm.removeControl(`mappool-${this.mappool.localId}-mod-bracket-${modBracket.index}-name`);

				for (const mod in modBracket.mods) {
					this.validationForm.removeControl(`mappool-${this.mappool.localId}-mod-bracket-mod-${modBracket.mods[mod].index}-value`);
				}

				if (this.mappool.mappoolType == MappoolType.AxS) {
					for (const beatmap in modBracket.beatmaps) {
						this.validationForm.removeControl(`mappool-${this.mappool.localId}-mod-bracket-beatmap-${modBracket.beatmaps[beatmap].index}-modifier`);
					}
				}

				this.toastService.addToast(`Successfully removed "${modBracket.name}" from the mappool.`);
			}
		});
	}

	/**
	 * Add a new mod bracket
	 */
	addNewMod(): void {
		if (this.modBracket.mods.length + 1 <= this.MAX_BRACKETS) {
			const newMod = new WyMod({
				index: this.modBracket.modIndex
			});

			this.modBracket.modIndex++;
			this.modBracket.mods.push(newMod);

			this.validationForm.addControl(`mappool-${this.mappool.localId}-mod-bracket-mod-${newMod.index}-value`, new FormControl('', Validators.required));
		}
		else {
			this.toastService.addToast('Maximum amount of mods reached.', ToastType.Warning);
		}
	}

	/**
	 * Delete a mod
	 * @param modIndex the index of the mod to delete
	 */
	deleteMod(modIndex: number): void {
		for (const mod in this.modBracket.mods) {
			if (this.modBracket.mods[mod].index == modIndex) {
				this.validationForm.removeControl(`mappool-${this.mappool.localId}-mod-bracket-mod-${this.modBracket.mods[mod].index}-value`);

				this.modBracket.mods.splice(Number(mod), 1);
				return;
			}
		}
	}

	/**
	 * Add a new beatmap to the given bracket
	 * @param bracket the bracket to add the beatmap to
	 */
	addBeatmap(bracket: WyModBracket): void {
		const newModBracketMap = new WyModBracketMap();

		newModBracketMap.index = this.modBracket.beatmapIndex;
		this.modBracket.beatmapIndex++;

		bracket.beatmaps.push(newModBracketMap);

		if (this.mappool.mappoolType == MappoolType.AxS) {
			this.validationForm.addControl(`mappool-${this.mappool.localId}-mod-bracket-beatmap-${newModBracketMap.index}-modifier`, new FormControl('', Validators.required));
		}
	}

	/**
	 * Add all beatmaps to the given bracket
	 * @param modBracket the bracket to add the beatmaps to
	 */
	addBulkBeatmaps(bracket: WyModBracket): void {
		const allBeatmaps = this.bulkBeatmaps.split(',');

		allBeatmaps.forEach(beatmapId => {
			const newModBracketMap = new WyModBracketMap();

			newModBracketMap.index = this.modBracket.beatmapIndex;
			this.modBracket.beatmapIndex++;

			newModBracketMap.beatmapId = parseInt(beatmapId.trim());

			bracket.beatmaps.push(newModBracketMap);

			if (this.mappool.mappoolType == MappoolType.AxS) {
				this.validationForm.addControl(`mappool-${this.mappool.localId}-mod-bracket-beatmap-${newModBracketMap.index}-modifier`, new FormControl('', Validators.required));
			}
		});
	}

	/**
	 * Get the data from the given beatmap
	 * @param beatmap the beatmap to synchronize
	 */
	synchronizeBeatmap(beatmap: WyModBracketMap): void {
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
	synchronizeAll(modBracket: WyModBracket): void {
		this.synchAllDisabled = true;

		for (const beatmap of modBracket.beatmaps) {
			this.synchronizeBeatmap(beatmap);
		}

		setTimeout(() => {
			this.synchAllDisabled = false;
		}, 3000);
	}

	/**
	 * Remove the given beatmap from the given bracket
	 * @param bracket the bracket to remove the beatmap from
	 * @param beatmap the beatmap to remove
	 */
	removeBeatmap(bracket: WyModBracket, beatmap: WyModBracketMap): void {
		bracket.beatmaps.splice(bracket.beatmaps.indexOf(beatmap), 1);

		if (this.mappool.mappoolType == MappoolType.AxS) {
			this.validationForm.removeControl(`mappool-${this.mappool.localId}-mod-bracket-beatmap-${beatmap.index}-modifier`);
		}
	}
}
