import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { AppConfig } from 'environments/environment';
import { map, startWith } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
	selector: 'app-tournament-wybin',
	templateUrl: './tournament-wybin.component.html',
	styleUrls: ['./tournament-wybin.component.scss']
})
export class TournamentWybinComponent implements OnInit {
	@Input() tournament: WyTournament;
	tournaments: { id: number; name: string }[];

	validationForm: FormGroup;

	tournamentSelection: string;
	options: string[];
	filteredOptions: Observable<string[]>;

	private readonly apiUrl = AppConfig.apiUrl;

	constructor(private http: HttpClient) {
		this.tournaments = [];
		this.options = [];

		this.validationForm = new FormGroup({
			tournamentName: new FormControl('', [Validators.required, (control) => this.matchValidator(control)])
		});
	}

	ngOnInit(): void {
		this.http.get<any[]>(`${this.apiUrl}tournament`).subscribe(tournaments => {
			for (const tournament of tournaments) {
				this.tournaments.push({ id: tournament.id, name: tournament.name });

				this.options.push(tournament.name);
			}

			this.filteredOptions = this.validationForm.get('tournamentName').valueChanges.pipe(
				startWith(''),
				map(value => this._filter(value || ''))
			);

			this.validationForm.get('tournamentName').valueChanges.subscribe(tournamentName => {
				if (this.options.includes(tournamentName)) {
					for (const tournament of this.tournaments) {
						if (tournament.name == tournamentName) {
							this.tournament.wyBinTournamentId = tournament.id;
						}
					}
				}
			});
		});
	}

	onWyBinTournamentChange(wyBinTournament: MatSelectChange) {
		this.tournament.wyBinTournamentId = wyBinTournament.value;
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.options.filter(option => option.toLowerCase().includes(filterValue));
	}

	private matchValidator(control: AbstractControl): ValidationErrors | null {
		return this.options.includes(control.value) ? null : { invalidMatch: true };
	}
}
