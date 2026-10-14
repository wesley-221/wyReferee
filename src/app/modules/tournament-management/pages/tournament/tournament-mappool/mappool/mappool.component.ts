import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { Gamemodes, Mods } from 'app/models/osu-models/osu';
import { WyMod } from 'app/models/wytournament/mappool/wy-mod';
import { FormGroupHelper } from '../../../../models/form-group-helper';

interface DefaultBracketDefinition {
	name: string;
	acronym: string;
	mods: { name: string; value: number | string }[];
}

@Component({
	selector: 'app-mappool',
	templateUrl: './mappool.component.html',
	styleUrls: ['./mappool.component.scss']
})
export class MappoolComponent implements OnChanges, OnInit {
	@Input() tournament: WyTournament;
	@Input() form: FormGroup;
	@Input() mappoolIndex: number;
	@Input() mappoolCount: number;

	@Output() moveEarlier = new EventEmitter<void>();
	@Output() moveLater = new EventEmitter<void>();
	@Output() deleteMappool = new EventEmitter<void>();

	activeModBracketIndex: number;
	showBracketCreator: boolean;
	bracketCreationMode: 'default' | 'empty';
	selectedDefaultBracketNames: Set<string>;
	addNoFailToBrackets: boolean;

	constructor() {
		this.activeModBracketIndex = 0;
		this.showBracketCreator = false;
		this.bracketCreationMode = 'default';
		this.selectedDefaultBracketNames = new Set<string>();
		this.addNoFailToBrackets = false;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.form) {
			this.activeModBracketIndex = 0;
		}
	}

	ngOnInit(): void {
		this.activeModBracketIndex = 0;
	}

	get modBrackets(): FormArray<FormGroup> {
		return this.form.get('modBrackets') as FormArray<FormGroup>;
	}

	get modCategories(): FormArray<FormGroup> {
		return this.form.get('modCategories') as FormArray<FormGroup>;
	}

	get defaultBracketOptions(): DefaultBracketDefinition[] {
		if (this.tournament.gamemodeId == Gamemodes.Mania as number) {
			return [
				{ name: 'Rice', acronym: 'RC', mods: [{ name: 'Freemod', value: 'freemod' }] },
				{ name: 'Long Note', acronym: 'LN', mods: [{ name: 'Freemod', value: 'freemod' }] },
				{ name: 'Hybrid', acronym: 'HB', mods: [{ name: 'Freemod', value: 'freemod' }] },
				{ name: 'Speed Velocity', acronym: 'SV', mods: [{ name: 'Freemod', value: 'freemod' }] },
				{ name: 'Tiebreaker', acronym: 'TB', mods: [{ name: 'Freemod', value: 'freemod' }] }
			];
		}

		if (this.tournament.gamemodeId == Gamemodes.Catch as number) {
			return [
				{ name: 'Nomod', acronym: 'NM', mods: [{ name: 'Nomod', value: Mods.None }] },
				{ name: 'Hidden', acronym: 'HD', mods: [{ name: 'Hidden', value: Mods.Hidden }] },
				{ name: 'Hardrock', acronym: 'HR', mods: [{ name: 'Freemod', value: 'freemod' }] },
				{ name: 'Doubletime', acronym: 'DT', mods: [{ name: 'Doubletime', value: Mods.DoubleTime }, { name: 'Freemod', value: 'freemod' }] },
				{ name: 'Tiebreaker', acronym: 'TB', mods: [{ name: 'Freemod', value: 'freemod' }] }
			];
		}

		return [
			{ name: 'Nomod', acronym: 'NM', mods: [{ name: 'Nomod', value: Mods.None }] },
			{ name: 'Hidden', acronym: 'HD', mods: [{ name: 'Hidden', value: Mods.Hidden }] },
			{ name: 'Hardrock', acronym: 'HR', mods: [{ name: 'Hardrock', value: Mods.HardRock }] },
			{ name: 'Doubletime', acronym: 'DT', mods: [{ name: 'Doubletime', value: Mods.DoubleTime }] },
			{ name: 'Tiebreaker', acronym: 'TB', mods: [{ name: 'Freemod', value: 'freemod' }] }
		];
	}

	get existingDefaultBracketCount(): number {
		return this.defaultBracketOptions.filter(bracket => this.defaultBracketExists(bracket)).length;
	}

	get selectedDefaultBracketCount(): number {
		return this.defaultBracketOptions.filter(bracket =>
			this.selectedDefaultBracketNames.has(bracket.name) && !this.defaultBracketExists(bracket)
		).length;
	}

	get bracketCreationCount(): number {
		return this.bracketCreationMode === 'empty' ? 1 : this.selectedDefaultBracketCount;
	}

	addNewCategory(): void {
		this.modCategories.push(FormGroupHelper.createModCategoryFormGroup());
	}

	deleteCategory(index: number): void {
		this.modCategories.removeAt(index);
	}

	toggleBracketCreator(): void {
		if (this.showBracketCreator) {
			this.closeBracketCreator();
		}
		else {
			this.openBracketCreator();
		}
	}

	openBracketCreator(): void {
		this.showBracketCreator = true;
		this.bracketCreationMode = 'default';
		this.addNoFailToBrackets = false;
		this.selectedDefaultBracketNames = new Set(
			this.defaultBracketOptions
				.filter(bracket => !this.defaultBracketExists(bracket))
				.map(bracket => bracket.name)
		);
	}

	closeBracketCreator(): void {
		this.showBracketCreator = false;
	}

	selectBracketCreationMode(mode: 'default' | 'empty'): void {
		this.bracketCreationMode = mode;
	}

	toggleDefaultBracket(name: string): void {
		if (this.selectedDefaultBracketNames.has(name)) {
			this.selectedDefaultBracketNames.delete(name);
		}
		else {
			this.selectedDefaultBracketNames.add(name);
		}
	}

	defaultBracketExists(bracket: DefaultBracketDefinition): boolean {
		const acronym = bracket.acronym.toLowerCase();
		return this.modBrackets.controls.some(control =>
			String(control.get('acronym')?.value ?? '').toLowerCase() === acronym
		);
	}

	createNewBracket(): void {
		const newModBracket = new WyModBracket({
			name: 'Unnamed mod bracket',
			collapsed: false
		});

		this.modBrackets.push(FormGroupHelper.createModBracketFormGroup(newModBracket));
		this.activeModBracketIndex = this.modBrackets.length - 1;
	}

	addConfiguredBrackets(): void {
		if (this.bracketCreationMode === 'empty') {
			this.createNewBracket();
		}
		else {
			const selectedBrackets = this.defaultBracketOptions.filter(bracket =>
				this.selectedDefaultBracketNames.has(bracket.name) && !this.defaultBracketExists(bracket)
			);
			for (const bracket of selectedBrackets) {
				this.createDefaultBracket(bracket, this.addNoFailToBrackets);
			}
			if (selectedBrackets.length > 0) {
				this.activeModBracketIndex = this.modBrackets.length - 1;
			}
		}

		this.closeBracketCreator();
	}

	selectModBracket(index: number): void {
		this.activeModBracketIndex = index;
	}

	onModBracketDeleted(index: number): void {
		if (this.activeModBracketIndex > index) {
			this.activeModBracketIndex--;
		}
		else if (this.activeModBracketIndex === index) {
			this.activeModBracketIndex = Math.min(index, this.modBrackets.length - 1);
		}
	}

	private createDefaultBracket(bracket: DefaultBracketDefinition, addNoFail: boolean): void {
		const newModBracket = new WyModBracket({
			name: bracket.name,
			acronym: bracket.acronym,
			collapsed: true
		});

		const mods = [...bracket.mods];
		if (addNoFail && !mods.some(mod => mod.value === Mods.NoFail)) {
			mods.push({ name: 'Nofail', value: Mods.NoFail });
		}

		mods.forEach(mod => {
			const newMod = new WyMod({
				name: mod.name,
				value: mod.value
			});

			newModBracket.mods.push(newMod);
		});

		this.modBrackets.push(FormGroupHelper.createModBracketFormGroup(newModBracket));
	}
}
