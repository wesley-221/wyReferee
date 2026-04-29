import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Calculate } from 'app/models/score-calculation/calculate';
import { TournamentFormat, WyTournament } from 'app/models/wytournament/wy-tournament';
import { WybinService } from 'app/services/wybin.service';
import { TournamentEditStateService } from '../../../services/tournament-edit-state.service';
import { debounceTime, filter } from 'rxjs';

@Component({
	selector: 'app-tournament-general',
	templateUrl: './tournament-general.component.html',
	styleUrls: ['./tournament-general.component.scss']
})
export class TournamentGeneralComponent implements OnInit {
	tournament: WyTournament;
	form: FormGroup;

	calculateScoreInterfaces: Calculate;
	importingFromWyBin: boolean;

	constructor(
		private wybinService: WybinService,
		private tournamentEditStateService: TournamentEditStateService
	) {
		this.calculateScoreInterfaces = new Calculate();
		this.importingFromWyBin = false;

		this.form = new FormGroup({
			name: new FormControl('', Validators.required),
			acronym: new FormControl('', Validators.required),
			gamemode: new FormControl(null, Validators.required),
			scoreSystem: new FormControl(null, Validators.required),
			protects: new FormControl(null, Validators.required),
			format: new FormControl(null, Validators.required),
			teamSize: new FormControl(null, [
				Validators.required,
				Validators.min(1),
				Validators.max(8)
			]),
			defaultTeamMode: new FormControl(null, Validators.required),
			defaultWinCondition: new FormControl(null, Validators.required),
			defaultPlayers: new FormControl(null, Validators.required),
			addrefUsernames: new FormControl(''),
			invalidateBeatmaps: new FormControl(false),
			allowDoublePick: new FormControl(false),
			lobbyTeamNameWithBrackets: new FormControl(false)
		});
	}

	ngOnInit(): void {
		this.tournamentEditStateService.getDraft$()
			.pipe(filter(v => !!v))
			.subscribe(tournament => {
				this.tournament = tournament;

				this.form.patchValue({
					name: tournament.name,
					acronym: tournament.acronym,
					gamemode: tournament.gamemodeId,
					scoreSystem: tournament.scoreInterfaceIdentifier,
					protects: tournament.protects,
					format: tournament.format,
					teamSize: tournament.teamSize,
					defaultTeamMode: tournament.defaultTeamMode,
					defaultWinCondition: tournament.defaultWinCondition,
					defaultPlayers: tournament.defaultPlayers,
					addrefUsernames: tournament.addrefUsernames,
					invalidateBeatmaps: tournament.invalidateBeatmaps,
					allowDoublePick: tournament.allowDoublePick,
					lobbyTeamNameWithBrackets: tournament.lobbyTeamNameWithBrackets
				}, { emitEvent: false });
			});

		this.form.valueChanges
			.pipe(debounceTime(200))
			.subscribe(value => {
				this.tournamentEditStateService.updateGeneral(value);
			});
	}

	/**
	 * Change the score interface
	 */
	changeScoreInterface(event: MatSelectChange): void {
		const selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(event.value);

		this.form.get('teamSize').setValue(selectedScoreInterface.getTeamSize());
		this.form.get('format').setValue((selectedScoreInterface.isSoloTournament() != null && selectedScoreInterface.isSoloTournament() == true ? TournamentFormat.Solo : TournamentFormat.Teams));

		// TODO: check if this is still required once i get to stages (maybe mappools?)
		// if (this.tournament.scoreInterface instanceof CTMCalculation && !(selectedScoreInterface instanceof CTMCalculation)) {
		// 	for (const stage of this.tournament.stages) {
		// 		this.form.removeControl(`tournament-stage-hitpoints-${stage.index}`);
		// 	}
		// }
		// else if (selectedScoreInterface instanceof CTMCalculation) {
		// 	for (const stage of this.tournament.stages) {
		// 		this.form.addControl(`tournament-stage-hitpoints-${stage.index}`, new FormControl('', Validators.required));
		// 	}
		// }

		// TODO: check if score interface is saved, other
		this.tournament.scoreInterface = selectedScoreInterface;
		this.tournament.scoreInterfaceIdentifier = selectedScoreInterface.getIdentifier();
	}

	/**
	 * Change the tournament format (solo or teams)
	 */
	changeTeamFormat(event: MatSelectChange): void {
		if (event.value == 'solo') {
			this.form.get('teamSize').setValue(1);
			this.tournament.teamSize = 1;
		}
	}

	/**
	 * Import streamers from wyBin
	 */
	importStreamers(): void {
		this.importingFromWyBin = true;
		const streamers: string[] = [];

		this.wybinService.importStaff(this.tournament.wyBinTournamentId).subscribe({
			next: (allStaff: any[]) => {
				for (const staff of allStaff) {
					let isStreamer = false;

					for (const role of staff.roles) {
						if (role.streamerPermission == true) {
							isStreamer = true;
							break;
						}
					}

					if (isStreamer == true) {
						streamers.push(staff.user.username);
					}
				}

				this.form.get('addrefUsernames').setValue(streamers.join(', '));

				this.importingFromWyBin = false;
			},
			error: () => {
				this.importingFromWyBin = false;
			}
		});
	}
}
