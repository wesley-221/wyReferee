import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'app/models/authentication/user';
import { ToastType } from 'app/models/toast';
import { Tournament } from 'app/models/tournament/tournament';
import { AuthenticateService } from 'app/services/authenticate.service';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-all-published-tournaments',
	templateUrl: './all-published-tournaments.component.html',
	styleUrls: ['./all-published-tournaments.component.scss']
})
export class AllPublishedTournamentsComponent implements OnInit {
	allTournaments: Tournament[] = [];
	allUsers: User[] = [];

	searchValue: string = '';
	filterByUser: string = '';

	filterByUserFormControl = new FormControl();
	filteredUsers: Observable<User[]>;

	usersImported$: BehaviorSubject<boolean>;

	constructor(private tournamentService: TournamentService, private authenticateService: AuthenticateService, private toastService: ToastService) {
		this.usersImported$ = new BehaviorSubject(false);

		this.tournamentService.getAllPublishedTournaments().subscribe(data => {
			for (const tournament in data) {
				const newTournament: Tournament = Tournament.serializeJson(data[tournament]);
				this.allTournaments.push(newTournament);
			}

			this.allTournaments.reverse();
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
	 * Import a tournament from the entered tournament id
	 */
	importTournament(tournament: Tournament) {
		this.tournamentService.getPublishedTournament(tournament.id).subscribe((data) => {
			const newTournament: Tournament = Tournament.serializeJson(data);
			newTournament.publishId = newTournament.id;
			newTournament.id = this.tournamentService.availableTournamentId;
			this.tournamentService.availableTournamentId++;

			this.tournamentService.saveTournament(newTournament);
			this.toastService.addToast(`Imported the tournament "${newTournament.tournamentName}".`);
		}, () => {
			this.toastService.addToast(`Unable to import the tournament with the id "${tournament.id}".`, ToastType.Error);
		});
	}

	private _filter(filterUser: string): User[] {
		return this.allUsers.filter(user => user.username.toLowerCase().includes(filterUser));
	}
}
