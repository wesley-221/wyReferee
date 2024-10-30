import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'app/models/authentication/user';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
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

	constructor(private tournamentService: TournamentService) {
		this.populateTournamentArray();

		this.usersImported$ = new BehaviorSubject(false);

		this.allUsers = [];

		this.searchValue = '';
		this.filterByUser = '';
	}

	ngOnInit(): void {
		this.usersImported$.subscribe(res => {
			if (res == true) {
				this.filteredUsers = this.filterByUserFormControl.valueChanges.pipe(
					startWith(''),
					map(value => this.filter(value))
				);
			}
		});
	}

	/**
	 * Repopulate the tournament array when a tournament gets deleted
	 *
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
				const newTournament = WyTournament.makeTrueCopy(tournament);

				this.allTournaments.push(WyTournament.makeTrueCopy(tournament));

				if (!this.allUsers.find(user => user.id == newTournament.createdBy.id)) {
					this.allUsers.push(newTournament.createdBy);
				}
			}

			this.allTournaments.reverse();
			this.allUsers.sort((a: User, b: User) => a.username.localeCompare(b.username));
			this.usersImported$.next(true);
		});
	}

	private filter(filterUser: string): User[] {
		return this.allUsers.filter(user => user.username.toLowerCase().includes(filterUser));
	}
}
