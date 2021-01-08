import { Component, OnInit, Input } from '@angular/core';
import { Mappool } from '../../../../models/osu-mappool/mappool';
import { ModBracket } from '../../../../models/osu-mappool/mod-bracket';
import { AuthenticateService } from '../../../../services/authenticate.service';
import { User } from '../../../../models/authentication/user';
import { ElectronService } from '../../../../services/electron.service';
import { ModCategory } from '../../../../models/osu-mappool/mod-category';
import { MappoolService } from '../../../../services/mappool.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
	selector: 'app-mappool',
	templateUrl: './mappool.component.html',
	styleUrls: ['./mappool.component.scss']
})
export class MappoolComponent implements OnInit {
	@Input() mappool: Mappool;
	@Input() validationForm: FormGroup;

	allUsers: User[] = [];
	searchValue: string;

	modBracketIndex = 0;

	constructor(private auth: AuthenticateService, public electronService: ElectronService, private mappoolService: MappoolService) {
		this.mappoolService.mappoolLoaded$.subscribe(response => {
			if (response == true) {
				this.auth.getAllUser().subscribe(userArray => {
					for (const item in userArray) {
						const user = User.serializeJson(userArray[item]);
						let foundUser = false;

						for (const i in this.mappool.availableTo) {
							if (user.id == this.mappool.availableTo[i].id) {
								foundUser = true;
							}
						}

						if (foundUser == false)
							this.allUsers.push(user);
					}

					this.mappoolService.mappoolLoaded$.next(false);
				});
			}
		});
	}

	ngOnInit(): void {
		if (this.mappool != null) {
			for (const modBracket of this.mappool.modBrackets) {
				this.validationForm.addControl(`mod-bracket-name-${modBracket.id}`, new FormControl(modBracket.bracketName, Validators.required));

				for (const mod of modBracket.mods) {
					this.validationForm.addControl(`mod-bracket-mod-index-${modBracket.validateIndex}-${mod.index}`, new FormControl((mod.modValue == 'freemod') ? mod.modValue : parseInt(mod.modValue), Validators.required));
				}

				let beatmapIndex = 0;

				for (const beatmap of modBracket.beatmaps) {
					beatmap.index = beatmapIndex;
					beatmapIndex++;

					this.validationForm.addControl(`beatmap-modifier-${modBracket.validateIndex}-${beatmap.index}`, new FormControl(beatmap.modifier, Validators.required));
				}
			}

			for (const modCategory of this.mappool.modCategories) {
				this.validationForm.addControl(`category-name-${modCategory.validateIndex}`, new FormControl(modCategory.categoryName, Validators.required));
			}
		}
	}

	/**
	 * Add a new user to to mappool
	 */
	addNewMappicker(user: User): void {
		this.allUsers.splice(this.allUsers.indexOf(user), 1);
		this.mappool.addUser(user);
	}

	/**
	 * Remove a user from the mappool
	 * @param user the user to delete
	 */
	removeMappicker(user: User): void {
		this.allUsers.push(user);
		this.mappool.removeUser(user);
	}

	/**
	 * Change the gamemode of the mappool
	 * @param event
	 */
	changeGamemode(event: MatSelectChange): void {
		this.mappool.gamemodeId = event.value;
	}

	/**
	 * Change the type of the mappool
	 * @param event
	 */
	changeMappoolType(event: MatSelectChange): void {
		this.mappool.mappoolType = event.value;
	}

	/**
	 * Change the availability of the mappool
	 * @param event
	 */
	changeAvailability(event: MatSelectChange): void {
		this.mappool.availability = event.value;
	}

	/**
	 * Create a new bracket
	 */
	createNewBracket(): void {
		const newModBracket = new ModBracket();
		newModBracket.validateIndex++;

		this.mappool.addBracket(newModBracket);
		this.validationForm.addControl(`mod-bracket-name-${newModBracket.id}`, new FormControl('', Validators.required));
	}

	/**
	 * Add a new mod category
	 */
	addNewCategory(): void {
		const newCategory = new ModCategory();
		newCategory.validateIndex = this.modBracketIndex++;
		this.mappool.addModCategory(newCategory);

		this.validationForm.addControl(`category-name-${newCategory.validateIndex}`, new FormControl('', Validators.required));
	}

	/**
	 * Delete a mod category
	 * @param index the index of the mod category to delete
	 */
	deleteCategory(category: ModCategory): void {
		this.mappool.removeModCategory(category);
		this.validationForm.addControl(`category-name-${category.validateIndex}`, new FormControl('', Validators.required));
	}

	getValidation(key: string): any {
		return this.validationForm.get(key);
	}
}
