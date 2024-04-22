import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MappoolType, WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WyModCategory } from 'app/models/wytournament/mappool/wy-mod-category';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { Gamemodes, Mods } from 'app/models/osu-models/osu';
import { WyMod } from 'app/models/wytournament/mappool/wy-mod';

@Component({
	selector: 'app-mappool',
	templateUrl: './mappool.component.html',
	styleUrls: ['./mappool.component.scss']
})
export class MappoolComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() mappool: WyMappool;
	@Input() validationForm: FormGroup;

	constructor() { }
	ngOnInit(): void { }

	/**
	 * When the name of the mappool gets changed
	 *
	 * @param evt
	 */
	onNameChange(evt: MatSelectChange) {
		this.mappool.name = evt.value;
	}

	/**
	 * Change the type of the mappool
	 *
	 * @param event
	 */
	changeMappoolType(event: MatSelectChange): void {
		if (event.value == MappoolType.AxS) {
			for (const modBracket of this.mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					this.validationForm.addControl(`mappool-${this.mappool.index}-mod-bracket-${modBracket.index}-beatmap-${beatmap.index}-modifier`, new FormControl(beatmap.modifier, Validators.required));
				}
			}
		}
		else if (event.value == MappoolType.CTMTournament) {
			for (const modBracket of this.mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					this.validationForm.addControl(`mappool-${this.mappool.index}-mod-bracket-${modBracket.index}-beatmap-${beatmap.index}-damage-amount`, new FormControl(beatmap.modifier, Validators.required));
				}
			}
		}
		else {
			for (const modBracket of this.mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					this.validationForm.removeControl(`mappool-${this.mappool.index}-mod-bracket-${modBracket.index}-beatmap-${beatmap.index}-modifier`);
					this.validationForm.removeControl(`mappool-${this.mappool.index}-mod-bracket-${modBracket.index}-beatmap-${beatmap.index}-damage-amount`);
				}
			}
		}

		this.mappool.type = event.value;
	}

	/**
	 * Add a new mod category
	 */
	addNewCategory(): void {
		const newCategory = new WyModCategory({
			index: this.mappool.modCategoryIndex
		});

		this.mappool.modCategoryIndex++;
		this.mappool.modCategories.push(newCategory);

		this.validationForm.addControl(`mappool-${this.mappool.index}-category-${newCategory.index}-name`, new FormControl('', Validators.required));
	}

	/**
	 * Delete a mod category
	 *
	 * @param category the mod category to delete
	 */
	deleteCategory(category: WyModCategory): void {
		for (const findCategory in this.mappool.modCategories) {
			if (this.mappool.modCategories[findCategory].index == category.index) {
				this.mappool.modCategories.splice(Number(findCategory), 1);
				break;
			}
		}

		this.validationForm.removeControl(`mappool-${this.mappool.index}-category-${category.index}-name`);
	}

	/**
	 * Create a new bracket
	 */
	createNewBracket(): void {
		const newModBracket = new WyModBracket({
			index: this.mappool.modBracketIndex,
			name: 'Unnamed mod bracket',
			collapsed: false,
			modIndex: 0,
			beatmapIndex: 0
		});

		this.mappool.modBracketIndex++;
		this.mappool.modBrackets.push(newModBracket);

		this.validationForm.addControl(`mappool-${this.mappool.index}-mod-bracket-${newModBracket.index}-name`, new FormControl('', Validators.required));
		this.validationForm.addControl(`mappool-${this.mappool.index}-mod-bracket-${newModBracket.index}-acronym`, new FormControl('', Validators.required));
	}

	/**
	 * Create default brackets
	 *
	 * @param nofail whether or not to add NoFail to the brackets
	 */
	createDefaultBrackets(nofail: boolean): void {
		if (this.tournament.gamemodeId == Gamemodes.Mania) {
			this.createDefaultBracket('Rice', 'RC', [{ name: 'Freemod', value: 'freemod' }]);
			this.createDefaultBracket('Long Note', 'LN', [{ name: 'Freemod', value: 'freemod' }]);
			this.createDefaultBracket('Hybrid', 'HB', [{ name: 'Freemod', value: 'freemod' }]);
			this.createDefaultBracket('Speed Velocity ', 'TB', [{ name: 'Freemod', value: 'freemod' }]);
		}
		else {
			if (nofail) {
				this.createDefaultBracket('Nomod', 'NM', [{ name: 'Nofail', value: Mods.NoFail }]);
				this.createDefaultBracket('Hidden', 'HD', [{ name: 'Hidden', value: Mods.Hidden }, { name: 'Nofail', value: Mods.NoFail }]);

				if (this.tournament.gamemodeId != Gamemodes.Catch) {
					this.createDefaultBracket('Hardrock', 'HR', [{ name: 'Hardrock', value: Mods.HardRock }, { name: 'Nofail', value: Mods.NoFail }]);
					this.createDefaultBracket('Doubletime', 'DT', [{ name: 'Doubletime', value: Mods.DoubleTime }, { name: 'Nofail', value: Mods.NoFail }]);
				}
			}
			else {
				this.createDefaultBracket('Nomod', 'NM', [{ name: 'Nomod', value: Mods.None }]);
				this.createDefaultBracket('Hidden', 'HD', [{ name: 'Hidden', value: Mods.Hidden }]);

				if (this.tournament.gamemodeId != Gamemodes.Catch) {
					this.createDefaultBracket('Hardrock', 'HR', [{ name: 'Hardrock', value: Mods.HardRock }]);
					this.createDefaultBracket('Doubletime', 'DT', [{ name: 'Doubletime', value: Mods.DoubleTime }]);
				}
			}

			if (this.tournament.gamemodeId == Gamemodes.Catch) {
				this.createDefaultBracket('Hardrock', 'HR', [{ name: 'Freemod', value: 'freemod' }]);
				this.createDefaultBracket('Doubletime', 'DT', [{ name: 'Doubletime', value: Mods.DoubleTime }, { name: 'Freemod', value: 'freemod' }]);
			}
		}

		this.createDefaultBracket('Tiebreaker', 'TB', [{ name: 'Freemod', value: 'freemod' }]);
	}

	/**
	 * Create a default bracket
	 *
	 * @param name the desired name for this bracket
	 * @param acronym the desired acronym for this bracket
	 * @param modsEnabled json array of desired mods for this bracket
	 */
	private createDefaultBracket(name: string, acronym: string, modsEnabled: any[]): void {
		// Create bracket object with name and acronym provided
		const newModBracket = new WyModBracket({
			index: this.mappool.modBracketIndex,
			name: name,
			acronym: acronym,
			collapsed: true,
			modIndex: 0,
			beatmapIndex: 0
		});

		// Create FormGroupControl to watch the text fields for them (and sync changes?)
		// Important: Pass in the same name and acronym as the initial values
		this.validationForm.addControl(`mappool-${this.mappool.index}-mod-bracket-${newModBracket.index}-name`, new FormControl(name, Validators.required));
		this.validationForm.addControl(`mappool-${this.mappool.index}-mod-bracket-${newModBracket.index}-acronym`, new FormControl(acronym, Validators.required));

		modsEnabled.forEach(mod => {
			// Create mod object with name and value = current mod
			const newMod = new WyMod({
				index: newModBracket.modIndex,
				name: mod.name,
				value: mod.value
			});

			newModBracket.modIndex++;
			newModBracket.mods.push(newMod);

			this.validationForm.addControl(`mappool-${this.mappool.index}-mod-bracket-${newModBracket.index}-mod-${newMod.index}-value`, new FormControl(mod.value, Validators.required));
		});

		// Increment bracket count and push bracket to list of brackets
		this.mappool.modBracketIndex++;
		this.mappool.modBrackets.push(newModBracket);
	}
}
