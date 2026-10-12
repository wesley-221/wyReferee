import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteModBracketDialogComponent } from 'app/components/dialogs/delete-mod-bracket-dialog/delete-mod-bracket-dialog.component';
import { Mods } from 'app/models/osu-models/osu';
import { ToastType } from 'app/models/toast';
import { MappoolType } from 'app/models/wytournament/mappool/wy-mappool';
import { WyMod } from 'app/models/wytournament/mappool/wy-mod';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WinConditionCompare, WinConditionWinner, WyModBracketMap } from 'app/models/wytournament/mappool/wy-mod-bracket-map';
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
export class ModBracketComponent implements OnInit, OnChanges {
	@Input() tournament: WyTournament;

	@Input() form: FormGroup;
	@Input() modBracketForm: FormArray;
	@Input() modBracketFormIndex: number;
	@Input() mappoolForm: FormGroup;

	@Input() mappoolType: MappoolType;

	@Output() modBracketDeleted = new EventEmitter<number>();
	@Output() modBracketMoved = new EventEmitter<number>();

	availableMods: WyMod[];
	MAX_BRACKETS: number;
	newModControl: FormControl<string | number | null>;
	bulkBeatmaps: string;
	synchAllDisabled: boolean;
	showBulkBeatmaps = false;
	openWinningConditionIndex: number = null;

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
		this.newModControl = new FormControl<string | number>(null);
		this.synchAllDisabled = false;
	}

	ngOnInit(): void { }

	ngOnChanges(): void {
		this.openWinningConditionIndex = null;
	}

	get mods(): FormArray<FormGroup> {
		return this.form.get('mods') as FormArray<FormGroup>;
	}

	get availableModsToAdd(): WyMod[] {
		if (this.mods.length >= this.MAX_BRACKETS) {
			return [];
		}

		return this.availableMods.filter(mod => !this.isModSelected(mod.value));
	}

	get beatmaps(): FormArray<FormGroup> {
		return this.form.get('beatmaps') as FormArray<FormGroup>;
	}

	get modCategories(): FormArray<FormGroup> {
		return this.mappoolForm.get('modCategories') as FormArray<FormGroup>;
	}

	get bulkBeatmapIds(): number[] {
		return (this.bulkBeatmaps ?? '')
			.split('\n')
			.map(line => parseInt(line.trim()))
			.filter(id => !isNaN(id));
	}

	/**
	 * Moves the mod bracket one position earlier in the list
	 */
	moveEarlier(): void {
		this.moveModBracket(this.modBracketFormIndex - 1);
	}

	/**
	 * Moves the mod bracket one position later in the list
	 */
	moveLater(): void {
		this.moveModBracket(this.modBracketFormIndex + 1);
	}

	/**
	 * Open a dialog to delete the mod bracket
	 */
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
				this.modBracketDeleted.emit(this.modBracketFormIndex);

				this.toastService.addToast(`Successfully removed "${modBracket.name}" from the mappool.`);
			}
		});
	}

	/**
	 * Adds the selected mod to the mod bracket
	 *
	 * @param value the value of the mod to add
	 */
	addMod(value: string | number): void {
		if (this.isModSelected(value)) {
			this.newModControl.setValue(null);
			return;
		}

		if (this.mods.length >= this.MAX_BRACKETS) {
			this.toastService.addToast('Maximum amount of mods reached.', ToastType.Warning);
			this.newModControl.setValue(null);
			return;
		}

		this.mods.push(FormGroupHelper.createModFormGroup(new WyMod({ name: this.getModName(value), value })));
		this.newModControl.setValue(null);
	}

	/**
	 * Get the mod name based on the value of the mod
	 *
	 * @param value the value of the mod to get the name for
	 */
	getModName(value: string | number): string {
		return this.availableMods.find(mod => mod.value === value)?.name ?? String(value);
	}

	/**
	 * Delete a mod from the given index
	 *
	 * @param index the index of the mod to delete
	 */
	deleteMod(index: number): void {
		this.mods.removeAt(index);
	}

	/**
	 * Moves the given beatmap to the target index
	 *
	 * @param index the current index of the beatmap to move
	 * @param targetIndex the target index to move the beatmap to
	 */
	moveBeatmap(index: number, targetIndex: number): void {
		if (targetIndex < 0 || targetIndex >= this.beatmaps.length) {
			return;
		}

		if (this.openWinningConditionIndex === index) {
			this.openWinningConditionIndex = targetIndex;
		}
		else if (this.openWinningConditionIndex === targetIndex) {
			this.openWinningConditionIndex = index;
		}

		const beatmap = this.beatmaps.at(index);
		this.beatmaps.removeAt(index, { emitEvent: false });
		this.beatmaps.insert(targetIndex, beatmap, { emitEvent: false });
		this.beatmaps.updateValueAndValidity();
	}

	/**
	 * Adds a single beatmap to the mod bracket
	 */
	addBeatmap(): void {
		this.beatmaps.push(FormGroupHelper.createBeatmapFormGroup());
	}

	/**
	 * Toggles the bulk beatmap input
	 */
	toggleBulkBeatmaps(): void {
		this.showBulkBeatmaps = !this.showBulkBeatmaps;
	}

	/**
	 * Closes the bulk beatmap input
	 */
	closeBulkBeatmaps(): void {
		this.showBulkBeatmaps = false;
		this.bulkBeatmaps = '';
	}

	/**
	 * Adds multiple beatmaps based on the entered beatmap ids
	 */
	addBulkBeatmaps(): void {
		this.bulkBeatmapIds.forEach(beatmapId => {
			const newModBracketMap = new WyModBracketMap();
			newModBracketMap.beatmapId = beatmapId;

			this.beatmaps.push(FormGroupHelper.createBeatmapFormGroup(newModBracketMap));
		});

		this.closeBulkBeatmaps();
	}

	/**
	 * Synchronizes the beatmap information for the given beatmap
	 *
	 * @param beatmapGroup the form group to synchronize the beatmap information for
	 */
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

	/**
	 * Toggles the winning condition panel for the beatmap
	 *
	 * @param index the beatmap to toggle the winning condition panel for
	 */
	toggleWinningCondition(index: number): void {
		this.openWinningConditionIndex = this.openWinningConditionIndex === index ? null : index;
	}

	/**
	 * Gets the winning condition comparison type
	 *
	 * @param beatmapGroup the beatmap form group
	 */
	getWinningConditionCompare(beatmapGroup: FormGroup): WinConditionCompare {
		return beatmapGroup.get('winningConditionCompare')?.value ?? 'score';
	}

	/**
	 * Gets the winning condition winner type
	 *
	 * @param beatmapGroup the beatmap form group
	 */
	getWinningConditionWinner(beatmapGroup: FormGroup): WinConditionWinner {
		return beatmapGroup.get('winningConditionWinner')?.value ?? (beatmapGroup.get('reverseScore')?.value ? 'lowest' : 'highest');
	}

	/**
	 * Sets the comparison type for winning condition
	 *
	 * @param beatmapGroup the beatmap form group
	 * @param compare the comparison type
	 */
	setWinningConditionCompare(beatmapGroup: FormGroup, compare: WinConditionCompare): void {
		beatmapGroup.get('winningConditionCompare').setValue(compare);
		this.syncReverseScore(beatmapGroup);
		beatmapGroup.markAsDirty();
	}

	/**
	 * Sets the winner type for winning condition
	 *
	 * @param beatmapGroup the beatmap form group
	 * @param winner the winner type
	 */
	setWinningConditionWinner(beatmapGroup: FormGroup, winner: WinConditionWinner): void {
		beatmapGroup.get('winningConditionWinner').setValue(winner);
		this.syncReverseScore(beatmapGroup);
		beatmapGroup.markAsDirty();
	}

	/**
	 * Resets the winning condition to default (highest score wins)
	 *
	 * @param beatmapGroup the beatmap form group
	 */
	resetWinningCondition(beatmapGroup: FormGroup): void {
		beatmapGroup.get('winningConditionCompare').setValue('score');
		beatmapGroup.get('winningConditionWinner').setValue('highest');
		beatmapGroup.get('reverseScore').setValue(false);
		beatmapGroup.markAsDirty();
	}

	/**
	 * Checks if the winning condition is the default condition (Highest score)
	 *
	 * @param beatmapGroup the beatmap form group
	 */
	isDefaultWinningCondition(beatmapGroup: FormGroup): boolean {
		return this.getWinningConditionCompare(beatmapGroup) === 'score' &&
			this.getWinningConditionWinner(beatmapGroup) === 'highest';
	}

	/**
	 * Gets the label for the winning condition dropdown button
	 *
	 * @param beatmapGroup the beatmap form group
	 */
	getWinningConditionLabel(beatmapGroup: FormGroup): string {
		const compare = this.getWinningConditionCompare(beatmapGroup);
		const winner = this.getWinningConditionWinner(beatmapGroup);
		const winnerLabel = winner === 'lowest' ? 'Lowest' : 'Highest';
		const compareLabel = compare === 'accuracy' ? 'accuracy' : compare === 'misses' ? 'misses' : 'score';

		return `${winnerLabel} ${compareLabel}`;
	}

	/**
	 * Gets the winning condition summary text
	 *
	 * @param beatmapGroup the beatmap form group
	 */
	getWinningConditionSummary(beatmapGroup: FormGroup): string {
		return `${this.getWinningConditionLabel(beatmapGroup)} wins`;
	}

	/**
	 * Synchronizes all beatmaps, updating the information for each one
	 */
	synchronizeAll(): void {
		this.synchAllDisabled = true;

		for (const beatmap of this.beatmaps.controls) {
			this.synchronizeBeatmap(beatmap);
		}

		setTimeout(() => {
			this.synchAllDisabled = false;
		}, 3000);
	}

	/**
	 * Removes the beatmap from the given index
	 *
	 * @param index the index of the beatmap to remove
	 */
	removeBeatmap(index: number): void {
		if (this.openWinningConditionIndex === index) {
			this.openWinningConditionIndex = null;
		}
		else if (this.openWinningConditionIndex !== null && this.openWinningConditionIndex > index) {
			this.openWinningConditionIndex--;
		}

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

	/**
	 * Check whether the mod has been selected already
	 *
	 * @param value the value of the mod to check
	 */
	private isModSelected(value: string | number): boolean {
		return this.mods.controls.some(mod => mod.get('value')?.value === value);
	}

	/**
	 * Moves the mod bracket to the given index
	 *
	 * @param targetIndex the index to move the mod bracket to
	 */
	private moveModBracket(targetIndex: number): void {
		if (targetIndex < 0 || targetIndex >= this.modBracketForm.length) {
			return;
		}

		const modBracket = this.modBracketForm.at(this.modBracketFormIndex);
		this.modBracketForm.removeAt(this.modBracketFormIndex, { emitEvent: false });
		this.modBracketForm.insert(targetIndex, modBracket, { emitEvent: false });
		this.modBracketForm.updateValueAndValidity();
		this.modBracketMoved.emit(targetIndex);
	}

	private syncReverseScore(beatmapGroup: FormGroup): void {
		const compare = this.getWinningConditionCompare(beatmapGroup);
		const winner = this.getWinningConditionWinner(beatmapGroup);
		beatmapGroup.get('reverseScore').setValue(compare === 'score' && winner === 'lowest');
	}
}
