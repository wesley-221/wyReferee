import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'app/models/authentication/user';
import { Mappool } from 'app/models/osu-mappool/mappool';
import { ToastType } from 'app/models/toast';
import { AuthenticateService } from 'app/services/authenticate.service';
import { MappoolService } from 'app/services/mappool.service';
import { ToastService } from 'app/services/toast.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-all-published-mappools',
	templateUrl: './all-published-mappools.component.html',
	styleUrls: ['./all-published-mappools.component.scss']
})
export class AllPublishedMappoolsComponent implements OnInit {
	allMappools: Mappool[] = [];
	allUsers: User[] = [];

	searchValue: string = '';
	filterByUser: string = '';

	filterByUserFormControl = new FormControl();
	filteredUsers: Observable<User[]>;

	usersImported$: BehaviorSubject<boolean>;

	constructor(private mappoolService: MappoolService, private authenticateService: AuthenticateService, private toastService: ToastService) {
		this.usersImported$ = new BehaviorSubject(false);

		this.mappoolService.getAllPublishedMappools().subscribe(data => {
			for (const mappool in data) {
				const newMappool: Mappool = Mappool.serializeJson(data[mappool]);
				this.allMappools.push(newMappool);
			}

			this.allMappools.reverse();
		});

		this.authenticateService.getAllUser().subscribe(data => {
			for (const user in data) {
				const newUser = User.serializeJson(data[user]);
				this.allUsers.push(newUser);
			}

			this.allUsers.sort((a: User, b: User) => {
				return a.username.localeCompare(b.username);
			})

			this.usersImported$.next(true);
		});
	}

	ngOnInit(): void {
		this.usersImported$.subscribe(res => {
			if (res == true) {
				this.filteredUsers = this.filterByUserFormControl.valueChanges.pipe(
					startWith(''),
					map(value => this._filter(value))
				)
			}
		})
	}

	/**
	 * Import a mappool from the entered mappool id
	 */
	importMappool(mappool: Mappool) {
		this.mappoolService.getPublishedMappool(mappool.id).subscribe((data) => {
			const newMappool: Mappool = Mappool.serializeJson(data);
			newMappool.publishId = newMappool.id;
			newMappool.id = this.mappoolService.availableMappoolId;
			this.mappoolService.availableMappoolId++;

			this.mappoolService.saveMappool(newMappool);
			this.toastService.addToast(`Imported the mappool "${newMappool.name}".`);
		}, () => {
			this.toastService.addToast(`Unable to import the mappool with the id "${mappool.id}".`, ToastType.Error);
		});
	}

	private _filter(filterUser: string): User[] {
		return this.allUsers.filter(user => user.username.toLowerCase().includes(filterUser));
	}
}
