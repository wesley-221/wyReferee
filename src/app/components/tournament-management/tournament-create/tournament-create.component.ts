import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Mods } from 'app/models/osu-models/osu';
import { ToastType } from 'app/models/toast';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';

@Component({
	selector: 'app-tournament-create',
	templateUrl: './tournament-create.component.html',
	styleUrls: ['./tournament-create.component.scss']
})
export class TournamentCreateComponent implements OnInit {
	tournament: WyTournament;
	validationForm: FormGroup;

	constructor(private toastService: ToastService, private tournamentService: TournamentService) {
		this.tournament = new WyTournament();

		this.validationForm = new FormGroup({
			'tournament-name': new FormControl('', [
				Validators.required
			]),
			'tournament-acronym': new FormControl('', [
				Validators.required
			]),
			'tournament-gamemode': new FormControl('', [
				Validators.required
			]),
			'tournament-score-system': new FormControl('', [
				Validators.required
			]),
			'tournament-format': new FormControl('', [
				Validators.required
			]),
			'tournament-team-size': new FormControl('', [
				Validators.required,
				Validators.min(1),
				Validators.max(8)
			])
		});
	}

	ngOnInit(): void { }

	createTournament(): void {
		if (this.validationForm.valid) {
			this.tournament.name = this.validationForm.get('tournament-name').value;
			this.tournament.acronym = this.validationForm.get('tournament-acronym').value;
			this.tournament.gamemodeId = this.validationForm.get('tournament-gamemode').value;

			this.tournament.format = this.validationForm.get('tournament-format').value;
			this.tournament.teamSize = this.validationForm.get('tournament-team-size').value;

			for (const mappool of this.tournament.mappools) {
				mappool.name = this.validationForm.get(`mappool-${mappool.localId}-name`).value;
				mappool.type = this.validationForm.get(`mappool-${mappool.localId}-type`).value;

				for (const modBracket of mappool.modBrackets) {
					for (const mod of modBracket.mods) {
						mod.value = this.validationForm.get(`mappool-${mappool.localId}-mod-bracket-mod-${mod.index}-value`).value;
						mod.name = mod.value == 'freemod' ? 'Freemod' : Mods[mod.value];
					}

					for (const category of mappool.modCategories) {
						category.name = this.validationForm.get(`mappool-${mappool.localId}-category-${category.index}-name`).value;
					}
				}
			}

			for (const webhook of this.tournament.webhooks) {
				webhook.name = this.validationForm.get(`webhook-${webhook.index}-name`).value;
				webhook.url = this.validationForm.get(`webhook-${webhook.index}-url`).value;

				webhook.matchCreation = this.validationForm.get(`webhook-${webhook.index}-match-creation`).value;
				webhook.picks = this.validationForm.get(`webhook-${webhook.index}-picks`).value;
				webhook.bans = this.validationForm.get(`webhook-${webhook.index}-bans`).value;
				webhook.matchResult = this.validationForm.get(`webhook-${webhook.index}-match-result`).value;
				webhook.finalResult = this.validationForm.get(`webhook-${webhook.index}-final-result`).value;
			}

			this.tournamentService.saveTournament(this.tournament);

			this.toastService.addToast(`Successfully created the tournament.`);
		}
		else {
			this.toastService.addToast(`The mappool wasn't filled in correctly. Look for the marked fields to see what you did wrong.`, ToastType.Error);
			this.validationForm.markAllAsTouched();
		}
	}
}
