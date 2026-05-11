import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteModBracketDialogComponent } from 'app/components/dialogs/delete-mod-bracket-dialog/delete-mod-bracket-dialog.component';
import { Mods } from 'app/models/osu-models/osu';
import { ToastType } from 'app/models/toast';
import { MappoolType } from 'app/models/wytournament/mappool/wy-mappool';
import { WyMod } from 'app/models/wytournament/mappool/wy-mod';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WyModBracketMap } from 'app/models/wytournament/mappool/wy-mod-bracket-map';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ElectronService } from 'app/services/electron.service';
import { GetBeatmap } from 'app/services/osu-api/get-beatmap.service';
import { ToastService } from 'app/services/toast.service';
import { FormGroupHelper } from '../../../../models/form-group-helper';

@Component({
	selector: 'app-mod-bracket',
	templateUrl: './mod-bracket.component.html',
	styleUrls: ['./mod-bracket.component.scss']
})
export class ModBracketComponent implements OnInit {
	@Input() tournament: WyTournament;

	@Input() form: FormGroup;
	@Input() modBracketForm: FormArray;
	@Input() modBracketFormIndex: number;
	@Input() mappoolForm: FormGroup;

	@Input() mappoolType: MappoolType;

	collapsed: boolean;

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
			new WyMod({ name: 'Relax', value: Mods.Relax }),
			new WyMod({ name: 'Freemod', value: 'freemod' })
		];

		this.MAX_BRACKETS = 4;
		this.synchAllDisabled = false;
		this.collapsed = true;
	}

	ngOnInit(): void { }

	get mods(): FormArray<FormGroup> {
		return this.form.get('mods') as FormArray<FormGroup>;
	}

	get beatmaps(): FormArray<FormGroup> {
		return this.form.get('beatmaps') as FormArray<FormGroup>;
	}

	get modCategories(): FormArray<FormGroup> {
		return this.mappoolForm.get('modCategories') as FormArray<FormGroup>;
	}

	collapseBracket(event: MouseEvent): void {
		if ((event.target as HTMLElement).closest('button')) {
			return;
		}

		this.collapsed = !this.collapsed;
	}

	deleteModBracket(): void {
		const modBracket = new WyModBracket({
			name: this.form.get('name').value
		})

		const dialogRef = this.dialog.open(DeleteModBracketDialogComponent, {
			data: {
				modBracket
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.modBracketForm.removeAt(this.modBracketFormIndex);

				this.toastService.addToast(`Successfully removed "${modBracket.name}" from the mappool.`);
			}
		});
	}

	addNewMod(): void {
		if (this.mods.length + 1 <= this.MAX_BRACKETS) {
			this.mods.push(FormGroupHelper.createModFormGroup());
		}
		else {
			this.toastService.addToast('Maximum amount of mods reached.', ToastType.Warning);
		}
	}

	deleteMod(index: number): void {
		this.mods.removeAt(index);
	}

	addBeatmap(): void {
		this.beatmaps.push(FormGroupHelper.createBeatmapFormGroup());
	}

	addBulkBeatmaps(): void {
		const allBeatmaps = this.bulkBeatmaps.split('\n');

		allBeatmaps.forEach(beatmapId => {
			const newModBracketMap = new WyModBracketMap();
			newModBracketMap.beatmapId = parseInt(beatmapId.trim());

			this.beatmaps.push(FormGroupHelper.createBeatmapFormGroup(newModBracketMap));
		});
	}

	synchronizeBeatmap(beatmapGroup: FormGroup): void {
		beatmapGroup.get('isSynchronizing').setValue(true);

		this.getBeatmap.getByBeatmapId(beatmapGroup.get('beatmapId').value).subscribe(data => {
			if (data.beatmap_id == null) {
				beatmapGroup.get('invalid').setValue(true);
			}
			else {
				beatmapGroup.get('beatmapName').setValue(data.getBeatmapname());
				beatmapGroup.get('beatmapUrl').setValue(data.getBeatmapUrl());
				beatmapGroup.get('beatmapsetId').setValue(data.beatmapset_id);
				beatmapGroup.get('beatmapId').setValue(data.beatmap_id);
				beatmapGroup.get('invalid').setValue(false);
			}

			beatmapGroup.get('isSynchronizing').setValue(false);
		});
	}

	reverseScore(beatmapGroup: FormGroup): void {
		beatmapGroup.get('reverseScore').setValue(!beatmapGroup.get('reverseScore').value);
	}

	synchronizeAll(): void {
		this.synchAllDisabled = true;

		for (const beatmap of this.beatmaps.controls) {
			this.synchronizeBeatmap(beatmap);
		}

		setTimeout(() => {
			this.synchAllDisabled = false;
		}, 3000);
	}

	removeBeatmap(index: number): void {
		this.beatmaps.removeAt(index);
	}

	/**
	 * Change the picked status for the given map
	 *
	 * @param beatmap
	 * @param event
	 */
	changePicked(beatmap: WyModBracketMap, event: MatSlideToggleChange): void {
		beatmap.picked = event.checked;
	}
}
