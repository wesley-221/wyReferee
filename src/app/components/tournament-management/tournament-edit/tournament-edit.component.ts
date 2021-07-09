import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Mods } from 'app/models/osu-models/osu';
import { Calculate } from 'app/models/score-calculation/calculate';
import { ToastType } from 'app/models/toast';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';

@Component({
	selector: 'app-tournament-edit',
	templateUrl: './tournament-edit.component.html',
	styleUrls: ['./tournament-edit.component.scss']
})
export class TournamentEditComponent implements OnInit {
	tournament: WyTournament;
	validationForm: FormGroup;

	constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private toastService: ToastService) {
		this.route.params.subscribe((params: Params) => {
			const tournament: WyTournament = this.tournamentService.getTournamentById(params.id);

			this.validationForm = new FormGroup({
				'tournament-name': new FormControl(tournament.name, [
					Validators.required
				]),
				'tournament-acronym': new FormControl(tournament.acronym, [
					Validators.required
				]),
				'tournament-gamemode': new FormControl(tournament.gamemode, [
					Validators.required
				]),
				'tournament-score-system': new FormControl('', [
					Validators.required
				]),
				'tournament-format': new FormControl(tournament.format, [
					Validators.required
				]),
				'tournament-team-size': new FormControl(tournament.teamSize, [
					Validators.required,
					Validators.min(1),
					Validators.max(8)
				]),
				'webhook': new FormControl(tournament.webhook),
				'test-webhook': new FormControl(tournament.testWebhook)
			});

			const calculateScoreInterfaces: Calculate = new Calculate();

			const selectedScoreInterface = calculateScoreInterfaces.getScoreInterface(tournament.scoreInterfaceIdentifier);
			tournament.scoreInterface = selectedScoreInterface;

			this.validationForm.get('tournament-score-system').setValue(tournament.scoreInterfaceIdentifier);

			for (const mappool of tournament.mappools) {
				mappool.collapsed = true;

				this.validationForm.addControl(`mappool-${mappool.localId}-name`, new FormControl(mappool.name, Validators.required));
				this.validationForm.addControl(`mappool-${mappool.localId}-type`, new FormControl(mappool.type, Validators.required));

				for (const modBracket of mappool.modBrackets) {
					modBracket.collapsed = true;

					this.validationForm.addControl(`mappool-${mappool.localId}-mod-bracket-${modBracket.index}-name`, new FormControl(modBracket.name, Validators.required));

					for (const mod of modBracket.mods) {
						this.validationForm.addControl(`mappool-${mappool.localId}-mod-bracket-mod-${mod.index}-value`, new FormControl(mod.value, Validators.required));
					}
				}

				for (const category of mappool.modCategories) {
					this.validationForm.addControl(`mappool-${mappool.localId}-category-${category.index}-name`, new FormControl(category.name, Validators.required));
				}
			}

			this.tournament = tournament;
		});
	}

	ngOnInit(): void { }

	/**
	 * Update the current tournament
	 */
	updateTournament(): void {
		if (this.validationForm.valid) {
			this.tournament.name = this.validationForm.get('tournament-name').value;
			this.tournament.acronym = this.validationForm.get('tournament-acronym').value;
			this.tournament.gamemode = this.validationForm.get('tournament-gamemode').value;

			this.tournament.format = this.validationForm.get('tournament-format').value;
			this.tournament.teamSize = this.validationForm.get('tournament-team-size').value;

			this.tournament.webhook = this.validationForm.get('webhook').value;
			this.tournament.testWebhook = this.validationForm.get('test-webhook').value;

			for (const mappool of this.tournament.mappools) {
				mappool.name = this.validationForm.get(`mappool-${mappool.localId}-name`).value;
				mappool.type = this.validationForm.get(`mappool-${mappool.localId}-type`).value;

				for (const modBracket of mappool.modBrackets) {
					for (const mod of modBracket.mods) {
						mod.value = this.validationForm.get(`mappool-${mappool.localId}-mod-bracket-mod-${mod.index}-value`).value;
						mod.name = mod.value == 'freemod' ? 'Freemod' : Mods[mod.value];
					}
				}
			}

			this.tournamentService.updateTournament(this.tournament);

			this.toastService.addToast(`Successfully updated the tournament.`);
		}
		else {
			this.toastService.addToast(`The mappool wasn't filled in correctly. Look for the marked fields to see what you did wrong.`, ToastType.Error);
			this.validationForm.markAllAsTouched();
		}
	}
}
