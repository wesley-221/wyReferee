import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { AppConfig } from 'environments/environment';

@Component({
	selector: 'app-tournament-wybin',
	templateUrl: './tournament-wybin.component.html',
	styleUrls: ['./tournament-wybin.component.scss']
})
export class TournamentWybinComponent implements OnInit {
	private readonly apiUrl = AppConfig.apiUrl;

	@Input() tournament: WyTournament;

	tournaments: { id: number, name: string }[];

	constructor(private http: HttpClient) {
		this.tournaments = [];
	}

	ngOnInit(): void {
		this.http.get<any[]>(`${this.apiUrl}tournament`).subscribe(tournaments => {
			for (const tournament of tournaments) {
				this.tournaments.push({ id: tournament.id, name: tournament.name });
			}
		})
	}

	onWyBinTournamentChange(wyBinTournament: MatSelectChange) {
		this.tournament.wyBinTournamentId = wyBinTournament.value;
	}
}
