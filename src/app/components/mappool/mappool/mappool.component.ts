import { Component, OnInit, Input } from '@angular/core';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { AuthenticateService } from '../../../services/authenticate.service';
import { User } from '../../../models/authentication/user';
import { ElectronService } from '../../../services/electron.service';
import { ModCategory } from '../../../models/osu-mappool/mod-category';

@Component({
	selector: 'app-mappool',
	templateUrl: './mappool.component.html',
	styleUrls: ['./mappool.component.scss']
})
export class MappoolComponent implements OnInit {
	@Input() mappool: Mappool;

	allUsers: User[] = [];
	allowedUsers: { index: number, userId: number }[] = [];
	userIndex: number = 0;

	constructor(private auth: AuthenticateService, public electronService: ElectronService) {
		this.auth.getAllUser().subscribe(data => {
			for (let i in data) {
				const user: User = User.mapFromJson(data[i]);
				this.allUsers.push(user);
			}
		});
	}

	ngOnInit(): void { }

	ngOnChanges(): void {
		if (this.mappool) {
			for (let user in this.mappool.availableTo) {
				this.allowedUsers.push({ index: this.userIndex + 1, userId: this.mappool.availableTo[user] });
				this.userIndex++;
			}
		}
	}

	/**
	 * Add a new user
	 */
	addNewUser() {
		this.allowedUsers.push({ index: this.userIndex + 1, userId: (this.allUsers.length > 0 ? this.allUsers[0].id : -1) });
		this.mappool.addUser((this.allUsers.length > 0 ? this.allUsers[0].id : -1));

		this.userIndex++;

		// Reset availability
		this.mappool.availableTo = [];

		for (let user in this.allowedUsers) {
			this.mappool.availableTo.push(this.allowedUsers[user].userId);
		}
	}

	/**
	 * Delete a user
	 * @param userIndex the index of the user to delete
	 */
	deleteUser(userIndex: number) {
		// Reset availability
		this.mappool.availableTo = [];

		for (let user in this.allowedUsers) {
			if (this.allowedUsers[user].index == userIndex) {
				this.mappool.removeUser(this.allowedUsers[user].userId);
				this.allowedUsers.splice(Number(user), 1);
			}

			this.mappool.availableTo.push(this.allowedUsers[user].userId);
		}
	}

	/**
	 * Change the value of the selected user
	 * @param userIndex the index of the user that has been changed
	 * @param userId the new value of the user
	 */
	changeUser(userIndex: number, userId: any) {
		userId = userId.target.value;

		// Reset availability
		this.mappool.availableTo = [];

		for (let i in this.allowedUsers) {
			if (this.allowedUsers[i].index == userIndex) {
				this.allowedUsers[i].userId = Number(userId);
			}

			this.mappool.availableTo.push(this.allowedUsers[i].userId);
		}
	}

	/**
	 * Find a user by the given id
	 * @param userId
	 */
	findUserById(userId: number) {
		for (let user in this.allUsers) {
			if (this.allUsers[user].id == userId) {
				return this.allUsers[user];
			}
		}

		return null;
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
