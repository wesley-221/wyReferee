import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Mods } from 'app/models/osu-models/osu';
import { Calculate } from 'app/models/score-calculation/calculate';
import { ToastType } from 'app/models/toast';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';

@Component({
	selector: 'app-tournament-edit',
	templateUrl: './tournament-edit.component.html',
	styleUrls: ['./tournament-edit.component.scss']
})
export class TournamentEditComponent implements OnInit {
	tournament: WyTournament;
	validationForm: FormGroup;

	constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private toastService: ToastService, private lobbyService: WyMultiplayerLobbiesService) {
		this.route.params.subscribe((params: Params) => {
			this.tournamentService.tournamentsHaveBeenInitialized().subscribe(initialized => {
				if (initialized == true) {
					const tournament: WyTournament = this.tournamentService.getTournamentById(params.id);

					this.validationForm = new FormGroup({
						'tournament-name': new FormControl(tournament.name, [
							Validators.required
						]),
						'tournament-acronym': new FormControl(tournament.acronym, [
							Validators.required
						]),
						'tournament-gamemode': new FormControl(tournament.gamemodeId, [
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
						'allow-double-pick': new FormControl(tournament.allowDoublePick),
						'invalidate-beatmaps': new FormControl(tournament.invalidateBeatmaps)
					});

					const calculateScoreInterfaces: Calculate = new Calculate();

					const selectedScoreInterface = calculateScoreInterfaces.getScoreInterface(tournament.scoreInterfaceIdentifier);
					tournament.scoreInterface = selectedScoreInterface;

					this.validationForm.get('tournament-score-system').setValue(tournament.scoreInterfaceIdentifier);

					for (const team of tournament.teams) {
						team.collapsed = true;
						this.validationForm.addControl(`tournament-team-name-${team.index}`, new FormControl(team.name, Validators.required));
					}

					for (const stage of tournament.stages) {
						this.validationForm.addControl(`tournament-stage-name-${stage.index}`, new FormControl(stage.name, Validators.required));
						this.validationForm.addControl(`tournament-stage-best-of-${stage.index}`, new FormControl(Number(stage.bestOf), Validators.required));
					}

					for (const webhook of tournament.webhooks) {
						this.validationForm.addControl(`webhook-${webhook.index}-name`, new FormControl(webhook.name, Validators.required));
						this.validationForm.addControl(`webhook-${webhook.index}-url`, new FormControl(webhook.url, Validators.required));

						this.validationForm.addControl(`webhook-${webhook.index}-match-creation`, new FormControl(webhook.matchCreation, Validators.required));
						this.validationForm.addControl(`webhook-${webhook.index}-picks`, new FormControl(webhook.picks, Validators.required));
						this.validationForm.addControl(`webhook-${webhook.index}-bans`, new FormControl(webhook.bans, Validators.required));
						this.validationForm.addControl(`webhook-${webhook.index}-match-result`, new FormControl(webhook.matchResult, Validators.required));
						this.validationForm.addControl(`webhook-${webhook.index}-final-result`, new FormControl(webhook.finalResult, Validators.required));
					}

					for (const mappool of tournament.mappools) {
						mappool.collapsed = true;

						this.validationForm.addControl(`mappool-${mappool.index}-name`, new FormControl(mappool.name, Validators.required));
						this.validationForm.addControl(`mappool-${mappool.index}-type`, new FormControl(mappool.type, Validators.required));

						for (const modBracket of mappool.modBrackets) {
							modBracket.collapsed = true;

							this.validationForm.addControl(`mappool-${mappool.index}-mod-bracket-${modBracket.index}-name`, new FormControl(modBracket.name, Validators.required));
							this.validationForm.addControl(`mappool-${mappool.index}-mod-bracket-${modBracket.index}-acronym`, new FormControl(modBracket.acronym, Validators.required));

							for (const mod of modBracket.mods) {
								if (mod.value != 'freemod') {
									this.validationForm.addControl(`mappool-${mappool.index}-mod-bracket-${modBracket.index}-mod-${mod.index}-value`, new FormControl(Number(mod.value), Validators.required));
								}
								else {
									this.validationForm.addControl(`mappool-${mappool.index}-mod-bracket-${modBracket.index}-mod-${mod.index}-value`, new FormControl(mod.value, Validators.required));
								}
							}
						}

						for (const category of mappool.modCategories) {
							this.validationForm.addControl(`mappool-${mappool.index}-category-${category.index}-name`, new FormControl(category.name, Validators.required));
						}
					}

					this.tournament = tournament;
				}
			});
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
			this.tournament.gamemodeId = this.validationForm.get('tournament-gamemode').value;

			this.tournament.format = this.validationForm.get('tournament-format').value;
			this.tournament.teamSize = this.validationForm.get('tournament-team-size').value;

			for (const mappool of this.tournament.mappools) {
				mappool.name = this.validationForm.get(`mappool-${mappool.index}-name`).value;
				mappool.type = this.validationForm.get(`mappool-${mappool.index}-type`).value;

				for (const modBracket of mappool.modBrackets) {
					for (const mod of modBracket.mods) {
						mod.value = this.validationForm.get(`mappool-${mappool.index}-mod-bracket-${modBracket.index}-mod-${mod.index}-value`).value;
						mod.name = mod.value == 'freemod' ? 'Freemod' : Mods[mod.value];
					}
				}

				for (const category of mappool.modCategories) {
					category.name = this.validationForm.get(`mappool-${mappool.index}-category-${category.index}-name`).value;
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

			this.tournamentService.updateTournament(this.tournament, this.tournament.id);

			for (const lobby in this.lobbyService.allLobbies) {
				if (this.lobbyService.allLobbies[lobby].tournamentId == this.tournament.id) {
					this.lobbyService.allLobbies[lobby].tournament = this.tournament;
				}
			}

			this.toastService.addToast('Successfully updated the tournament.');
		}
		else {
			this.toastService.addToast('The mappool wasn\'t filled in correctly. Look for the marked fields to see what you did wrong.', ToastType.Error);
			this.validationForm.markAllAsTouched();
		}
	}
}
