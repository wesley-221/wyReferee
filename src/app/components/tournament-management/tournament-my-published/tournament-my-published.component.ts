import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'app/models/authentication/user';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { AuthenticateService } from 'app/services/authenticate.service';
import { TournamentService } from 'app/services/tournament.service';
import { Observable, BehaviorSubject, startWith, map } from 'rxjs';

@Component({
	selector: 'app-tournament-my-published',
	templateUrl: './tournament-my-published.component.html',
	styleUrls: ['./tournament-my-published.component.scss']
})
export class TournamentMyPublishedComponent implements OnInit {
	allTournaments: WyTournament[];
	allUsers: User[];

	searchValue: string;
	filterByUser: string;

	filterByUserFormControl = new FormControl();
	filteredUsers: Observable<User[]>;

	usersImported$: BehaviorSubject<boolean>;

	constructor(private tournamentService: TournamentService, private authenticateService: AuthenticateService) {
		this.populateTournamentArray();

		this.usersImported$ = new BehaviorSubject(false);

		this.allUsers = [];

		this.searchValue = '';
		this.filterByUser = '';

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
		});
	}

	/**
	 * Repopulate the tournament array when a tournament gets deleted
	 * @param deleted if the tournament is deleted
	 */
	onTournamentDeleted(deleted: boolean) {
		if (deleted == true) {
			this.populateTournamentArray();
		}
	}

	/**
	 * Populate the tournaments array
	 */
	private populateTournamentArray(): void {
		this.allTournaments = [];

		this.tournamentService.getAllPublishedTournamentsWithAdminPermissions().subscribe(tournaments => {
			for (const tournament of tournaments) {
				this.allTournaments.push(WyTournament.makeTrueCopy(tournament));
			}

			this.allTournaments.reverse();
		});
	}

	private _filter(filterUser: string): User[] {
		return this.allUsers.filter(user => user.username.toLowerCase().includes(filterUser));
	}
}
