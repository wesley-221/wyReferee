import { Component, OnInit, Input } from '@angular/core';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { AuthenticateService } from '../../../services/authenticate.service';
import { User } from '../../../models/authentication/user';
import { ElectronService } from '../../../services/electron.service';
import { ModCategory } from '../../../models/osu-mappool/mod-category';
import { MappoolService } from '../../../services/mappool.service';

@Component({
	selector: 'app-mappool',
	templateUrl: './mappool.component.html',
	styleUrls: ['./mappool.component.scss']
})
export class MappoolComponent implements OnInit {
	@Input() mappool: Mappool;

	allUsers: User[] = [];
	searchValue: string;

	constructor(private auth: AuthenticateService, public electronService: ElectronService, private mappoolService: MappoolService) {
		this.mappoolService.mappoolLoaded$.subscribe(response => {
			if (response == true) {
				this.auth.getAllUser().subscribe(userArray => {
					for (let item in userArray) {
						const user = User.serializeJson(userArray[item]);
						let foundUser = false;

						for (let i in this.mappool.availableTo) {
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

	ngOnInit(): void { }

	/**
	 * Add a new user to to mappool
	 */
	addNewMappicker(user: User) {
		this.allUsers.splice(this.allUsers.indexOf(user), 1);
		this.mappool.addUser(user);
	}

	/**
	 * Remove a user from the mappool
	 * @param user the user to delete
	 */
	removeMappicker(user: User) {
		this.allUsers.push(user);
		this.mappool.removeUser(user);
	}

	/**
	 * Change the gamemode of the mappool
	 * @param event
	 */
	changeGamemode(event) {
		this.mappool.gamemodeId = event.target.value;
	}

	/**
	 * Change the availability of the mappool
	 * @param event
	 */
	changeAvailability(event) {
		this.mappool.availability = event.target.value;
	}

	/**
	 * Create a new bracket
	 */
	createNewBracket() {
		this.mappool.addBracket(new ModBracket());
	}

	/**
	 * Add a new mod category
	 */
	addNewCategory() {
		const newCategory = new ModCategory();
		this.mappool.addModCategory(newCategory);
	}

	/**
	 * Delete a mod category
	 * @param index the index of the mod category to delete
	 */
	deleteCategory(category: ModCategory) {
		this.mappool.removeModCategory(category);
	}
}
