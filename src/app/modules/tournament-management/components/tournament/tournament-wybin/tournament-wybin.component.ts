import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { AppConfig } from 'environments/environment';
import { debounceTime, filter, map, startWith } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { TournamentEditStateService } from '../../../services/tournament-edit-state.service';

@Component({
	selector: 'app-tournament-wybin',
	templateUrl: './tournament-wybin.component.html',
	styleUrls: ['./tournament-wybin.component.scss']
})
export class TournamentWybinComponent implements OnInit {
	@Input() tournament: WyTournament;
	form: FormGroup;

	tournaments: { id: number; name: string }[] = [];
	filteredOptions: Observable<{ id: number; name: string }[]>;

	private readonly apiUrl = AppConfig.apiUrl;

	constructor(
		private http: HttpClient,
		private tournamentEditStateService: TournamentEditStateService
	) {
		this.form = new FormGroup({
			wyBinTournamentId: new FormControl('', [
				this.matchValidator.bind(this)
			])
		});
	}

	ngOnInit(): void {
		this.http.get<any[]>(`${this.apiUrl}tournament`).subscribe(tournaments => {
			this.tournaments = tournaments.map(t => ({
				id: t.id,
				name: t.name
			}));

			this.filteredOptions = this.form.get('wyBinTournamentId').valueChanges.pipe(
				startWith(''),
				map(value => {
					if (typeof value === 'number') {
						const found = this.tournaments.find(t => t.id === value);
						return this.filter(found?.name ?? '');
					}

					return this.filter(value || '');
				})
			);

			this.tournamentEditStateService.getDraft$()
				.pipe(filter(v => !!v))
				.subscribe(tournament => {
					this.tournament = tournament;

					this.form.patchValue({
						wyBinTournamentId: tournament.wyBinTournamentId
					}, { emitEvent: false });
				});

			this.form.valueChanges
				.pipe(
					debounceTime(200),
					map(value => value.wyBinTournamentId),
					filter(value => typeof value === 'number')
				)
				.subscribe(value => {
					this.tournamentEditStateService.updateWyBinForm({
						wyBinTournamentId: value
					});
				});
		});
	}

	displayTournamentName = (id: number): string => {
		if (!id) {
			return '';
		}

		const findTournament = this.tournaments.find(t => t.id === id);
		return findTournament ? findTournament.name : '';
	};

	private filter(value: string): { id: number; name: string }[] {
		const filterValue = value.toLowerCase();

		return this.tournaments.filter(option =>
			option.name.toLowerCase().includes(filterValue)
		);
	}

	private matchValidator(control: AbstractControl): ValidationErrors | null {
		return this.tournaments.some(option => option.id === control.value) ? null : { invalidMatch: true };
	}
}
