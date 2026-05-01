import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { Gamemodes, Mods } from 'app/models/osu-models/osu';
import { WyMod } from 'app/models/wytournament/mappool/wy-mod';
import { FormGroupHelper } from '../../../../models/form-group-helper';

@Component({
	selector: 'app-mappool',
	templateUrl: './mappool.component.html',
	styleUrls: ['./mappool.component.scss']
})
export class MappoolComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() form: FormGroup;

	constructor() { }

	ngOnInit(): void { }

	get modBrackets(): FormArray<FormGroup> {
		return this.form.get('modBrackets') as FormArray<FormGroup>;
	}

	get modCategories(): FormArray<FormGroup> {
		return this.form.get('modCategories') as FormArray<FormGroup>;
	}

	addNewCategory(): void {
		this.modCategories.push(FormGroupHelper.createModCategoryFormGroup());
	}

	deleteCategory(index: number): void {
		this.modCategories.removeAt(index);
	}

	createNewBracket(): void {
		const newModBracket = new WyModBracket({
			name: 'Unnamed mod bracket',
			collapsed: false
		});

		this.modBrackets.push(FormGroupHelper.createModBracketFormGroup(newModBracket));
	}

	createDefaultBrackets(nofail: boolean): void {
		if (this.tournament.gamemodeId == Gamemodes.Mania as number) {
			this.createDefaultBracket('Rice', 'RC', [{ name: 'Freemod', value: 'freemod' }]);
			this.createDefaultBracket('Long Note', 'LN', [{ name: 'Freemod', value: 'freemod' }]);
			this.createDefaultBracket('Hybrid', 'HB', [{ name: 'Freemod', value: 'freemod' }]);
			this.createDefaultBracket('Speed Velocity ', 'TB', [{ name: 'Freemod', value: 'freemod' }]);
		}
		else {
			if (nofail) {
				this.createDefaultBracket('Nomod', 'NM', [{ name: 'Nofail', value: Mods.NoFail }]);
				this.createDefaultBracket('Hidden', 'HD', [{ name: 'Hidden', value: Mods.Hidden }, { name: 'Nofail', value: Mods.NoFail }]);

				if (this.tournament.gamemodeId != Gamemodes.Catch as number) {
					this.createDefaultBracket('Hardrock', 'HR', [{ name: 'Hardrock', value: Mods.HardRock }, { name: 'Nofail', value: Mods.NoFail }]);
					this.createDefaultBracket('Doubletime', 'DT', [{ name: 'Doubletime', value: Mods.DoubleTime }, { name: 'Nofail', value: Mods.NoFail }]);
				}
			}
			else {
				this.createDefaultBracket('Nomod', 'NM', [{ name: 'Nomod', value: Mods.None }]);
				this.createDefaultBracket('Hidden', 'HD', [{ name: 'Hidden', value: Mods.Hidden }]);

				if (this.tournament.gamemodeId != Gamemodes.Catch as number) {
					this.createDefaultBracket('Hardrock', 'HR', [{ name: 'Hardrock', value: Mods.HardRock }]);
					this.createDefaultBracket('Doubletime', 'DT', [{ name: 'Doubletime', value: Mods.DoubleTime }]);
				}
			}

			if (this.tournament.gamemodeId == Gamemodes.Catch as number) {
				this.createDefaultBracket('Hardrock', 'HR', [{ name: 'Freemod', value: 'freemod' }]);
				this.createDefaultBracket('Doubletime', 'DT', [{ name: 'Doubletime', value: Mods.DoubleTime }, { name: 'Freemod', value: 'freemod' }]);
			}
		}

		this.createDefaultBracket('Tiebreaker', 'TB', [{ name: 'Freemod', value: 'freemod' }]);
	}

	private createDefaultBracket(name: string, acronym: string, modsEnabled: any[]): void {
		const newModBracket = new WyModBracket({
			name: name,
			acronym: acronym,
			collapsed: true
		});

		modsEnabled.forEach(mod => {
			const newMod = new WyMod({
				name: mod.name,
				value: mod.value
			});

			newModBracket.mods.push(newMod);
		});

		this.modBrackets.push(FormGroupHelper.createModBracketFormGroup(newModBracket));
	}
}
