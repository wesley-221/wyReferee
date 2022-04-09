import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MappoolType, WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { WyModBracket } from 'app/models/wytournament/mappool/wy-mod-bracket';
import { WyModCategory } from 'app/models/wytournament/mappool/wy-mod-category';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

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
		else {
			for (const modBracket of this.mappool.modBrackets) {
				for (const beatmap of modBracket.beatmaps) {
					this.validationForm.removeControl(`mappool-${this.mappool.index}-mod-bracket-${modBracket.index}-beatmap-${beatmap.index}-modifier`);
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
	 * @param index the index of the mod category to delete
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
}
