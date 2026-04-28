import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map, combineLatest } from 'rxjs';
import { User } from '../../../../models/authentication/user';
import { TournamentFilter } from '../../models/tournament-filter';

@Component({
	selector: 'app-tournament-filters',
	templateUrl: './tournament-filters.component.html',
	styleUrl: './tournament-filters.component.scss'
})
export class TournamentFiltersComponent implements OnInit {
	@Input() users$: Observable<User[]>;
	@Output() filtersChanged = new EventEmitter<TournamentFilter>();

	searchControl = new FormControl('');
	userControl = new FormControl('');
	filteredUsers$: Observable<User[]>;

	ngOnInit() {
		this.filteredUsers$ = combineLatest([
			this.users$,
			this.userControl.valueChanges.pipe(startWith(''))
		]).pipe(
			map(([users, value]) => {
				const filterValue = (value || '').toLowerCase();

				if (!filterValue) {
					return users || [];
				}

				return (users || []).filter(user =>
					user.username.toLowerCase().includes(filterValue)
				);
			})
		);

		combineLatest([
			this.searchControl.valueChanges.pipe(startWith('')),
			this.userControl.valueChanges.pipe(startWith(''))
		]).subscribe(([search, username]) => {
			this.filtersChanged.emit({
				search: search || '',
				username: username || ''
			});
		});
	}
}
