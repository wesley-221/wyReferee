import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'app/models/authentication/user';
import { ToastType } from 'app/models/toast';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { AuthenticateService } from 'app/services/authenticate.service';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { Observable, BehaviorSubject, startWith, map } from 'rxjs';

@Component({
	selector: 'app-tournament-all-published',
	templateUrl: './tournament-all-published.component.html',
	styleUrls: ['./tournament-all-published.component.scss']
})
export class TournamentAllPublishedComponent implements OnInit {
	allTournaments: WyTournament[];
	allUsers: User[];

	searchValue: string;
	filterByUser: string;

	filterByUserFormControl = new FormControl();
	filteredUsers: Observable<User[]>;

	usersImported$: BehaviorSubject<boolean>;

	constructor(private tournamentService: TournamentService, private authenticateService: AuthenticateService, private toastService: ToastService) {
		this.usersImported$ = new BehaviorSubject(false);

		this.allTournaments = [];
		this.allUsers = [];

		this.searchValue = '';
		this.filterByUser = '';

		this.tournamentService.getAllPublishedTournaments().subscribe(tournaments => {
			for (const tournament of tournaments) {
				this.allTournaments.push(WyTournament.makeTrueCopy(tournament));
			}

			this.allTournaments.reverse();
		});

		this.authenticateService.getAllUser().subscribe(data => {
			for (const user in data) {
				const newUser = User.serializeJson(data[user]);
				this.allUsers.push(newUser);
			}

			this.allUsers.sort((a: User, b: User) => a.username.localeCompare(b.username));

			this.usersImported$.next(true);
		});
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
	 * Import a tournament from the entered tournament id
	 */
	importTournament(tournament: WyTournament) {
		this.tournamentService.getPublishedTournament(tournament.id).subscribe((data) => {
			const newTournament: WyTournament = WyTournament.makeTrueCopy(data);
			newTournament.publishId = newTournament.id;
			newTournament.id = this.tournamentService.availableTournamentId;
			this.tournamentService.availableTournamentId++;

			this.tournamentService.saveTournament(newTournament);
			this.toastService.addToast(`Imported the tournament "${newTournament.name}".`);
		}, () => {
			this.toastService.addToast(`Unable to import the tournament with the id "${tournament.id}".`, ToastType.Error);
		});
	}

	private filter(filterUser: string): User[] {
		return this.allUsers.filter(user => user.username.toLowerCase().includes(filterUser));
	}
}
