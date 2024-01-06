import { Component, OnInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Mods } from 'app/models/osu-models/osu';
import { Calculate } from 'app/models/score-calculation/calculate';
import { CTMCalculation } from 'app/models/score-calculation/calculation-types/ctm-calculation';
import { ToastType } from 'app/models/toast';
import { MappoolType } from 'app/models/wytournament/mappool/wy-mappool';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ValidationErrorService } from 'app/modules/tournament-management/services/validation-error.service';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';

@Component({
	selector: 'app-tournament-edit',
	templateUrl: './tournament-edit.component.html',
	styleUrls: ['./tournament-edit.component.scss']
})
export class TournamentEditComponent implements OnInit {
	@ViewChild('container') container: ElementRef;
	tournamentLoaded$: EventEmitter<{ loaded: boolean; tournament: WyTournament }>;

	tournament: WyTournament;
	isPublishedTournament: boolean;
	validationForm: FormGroup;

	errors: string[];

	constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private lobbyService: WyMultiplayerLobbiesService, private validationErrorService: ValidationErrorService, private toastService: ToastService) {
		this.errors = [];
		this.tournamentLoaded$ = new EventEmitter();

		this.tournamentLoaded$.subscribe(tournamentLoaded => {
			if (tournamentLoaded.loaded && tournamentLoaded.loaded == true) {
				const tournament = tournamentLoaded.tournament;

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
					'tournament-protects': new FormControl(tournament.protects, [
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
					'invalidate-beatmaps': new FormControl(tournament.invalidateBeatmaps),
					'lobby-team-name-with-brackets': new FormControl(tournament.lobbyTeamNameWithBrackets)
				});

				const calculateScoreInterfaces: Calculate = new Calculate();

				const selectedScoreInterface = calculateScoreInterfaces.getScoreInterface(tournament.scoreInterfaceIdentifier);
				tournament.scoreInterface = selectedScoreInterface;

				this.validationForm.get('tournament-score-system').setValue(tournament.scoreInterfaceIdentifier);

				for (const team of tournament.teams) {
					team.collapsed = true;
					this.validationForm.addControl(`tournament-team-name-${team.index}`, new FormControl(team.name, Validators.required));

					if (tournament.isSoloTournament()) {
						this.validationForm.addControl(`tournament-player-user-id-${team.index}`, new FormControl(team.userId));
					}
				}

				for (const stage of tournament.stages) {
					this.validationForm.addControl(`tournament-stage-name-${stage.index}`, new FormControl(stage.name, Validators.required));
					this.validationForm.addControl(`tournament-stage-best-of-${stage.index}`, new FormControl(Number(stage.bestOf), Validators.required));
					this.validationForm.addControl(`tournament-stage-bans-${stage.index}`, new FormControl(Number(stage.bans)));

					if (tournament.scoreInterface instanceof CTMCalculation) {
						this.validationForm.addControl(`tournament-stage-hitpoints-${stage.index}`, new FormControl(stage.hitpoints, Validators.required));
					}
				}

				for (const webhook of tournament.webhooks) {
					this.validationForm.addControl(`webhook-${webhook.index}-name`, new FormControl(webhook.name, Validators.required));
					this.validationForm.addControl(`webhook-${webhook.index}-url`, new FormControl(webhook.url, Validators.required));

					this.validationForm.addControl(`webhook-${webhook.index}-match-creation`, new FormControl(webhook.matchCreation, Validators.required));
					this.validationForm.addControl(`webhook-${webhook.index}-picks`, new FormControl(webhook.picks, Validators.required));
					this.validationForm.addControl(`webhook-${webhook.index}-bans`, new FormControl(webhook.bans, Validators.required));
					this.validationForm.addControl(`webhook-${webhook.index}-match-summary`, new FormControl(webhook.matchSummary, Validators.required));
					this.validationForm.addControl(`webhook-${webhook.index}-match-result`, new FormControl(webhook.matchResult, Validators.required));
					this.validationForm.addControl(`webhook-${webhook.index}-final-result`, new FormControl(webhook.finalResult, Validators.required));
				}

				for (const beatmapResultMessage of tournament.beatmapResultMessages) {
					this.validationForm.addControl(`beatmap-result-message-${beatmapResultMessage.index}`, new FormControl(beatmapResultMessage.message, Validators.required));
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

						if (mappool.type == MappoolType.AxS) {
							for (const beatmap of modBracket.beatmaps) {
								this.validationForm.addControl(`mappool-${mappool.index}-mod-bracket-${modBracket.index}-beatmap-${beatmap.index}-modifier`, new FormControl(beatmap.modifier, Validators.required));
							}
						}

						if (mappool.type == MappoolType.CTMTournament) {
							for (const beatmap of modBracket.beatmaps) {
								this.validationForm.addControl(`mappool-${mappool.index}-mod-bracket-${modBracket.index}-beatmap-${beatmap.index}-damage-amount`, new FormControl(beatmap.damageAmount, Validators.required));
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
	}

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.isPublishedTournament = parseInt(params.published) == 0 ? false : true;
			const tournamentId = parseInt(params.id);

			if (this.isPublishedTournament == false) {
				this.tournamentService.tournamentsHaveBeenInitialized().subscribe(initialized => {
					if (initialized == true) {
						const tournament = WyTournament.makeTrueCopy(this.tournamentService.getTournamentById(params.id));

						this.tournamentLoaded$.emit({ loaded: true, tournament: tournament });
					}
				});
			}
			else if (this.isPublishedTournament == true) {
				this.tournamentService.getPublishedTournament(tournamentId).subscribe(publishedTournament => {
					const tournament = WyTournament.makeTrueCopy(publishedTournament);
					tournament.publishId = tournament.id;

					this.tournamentLoaded$.emit({ loaded: true, tournament: tournament });
				});
			}
		});
	}

	/**
	 * Update the current tournament
	 */
	updateTournament(): void {
		if (this.validationForm.invalid) {
			this.validationForm.markAllAsTouched();
			this.errors = [];

			for (const validatorKey in this.validationForm.controls) {
				const control = this.validationForm.controls[validatorKey];

				if (control.errors != null) {
					const errorMessage = this.validationErrorService.getErrorMessage(validatorKey);
					this.errors.push(errorMessage);
				}
			}

			this.container.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

			return;
		}

		this.errors = [];

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
			webhook.matchSummary = this.validationForm.get(`webhook-${webhook.index}-match-summary`).value;
			webhook.matchResult = this.validationForm.get(`webhook-${webhook.index}-match-result`).value;
			webhook.finalResult = this.validationForm.get(`webhook-${webhook.index}-final-result`).value;
		}

		for (const beatmapResultMessage of this.tournament.beatmapResultMessages) {
			beatmapResultMessage.message = this.validationForm.get(`beatmap-result-message-${beatmapResultMessage.index}`).value;
		}

		if (this.isPublishedTournament == false) {
			this.tournamentService.updateTournament(this.tournament, this.tournament.id);

			for (const lobby in this.lobbyService.allLobbies) {
				if (this.lobbyService.allLobbies[lobby].tournamentId == this.tournament.id) {
					this.lobbyService.allLobbies[lobby].tournament = this.tournament;
				}
			}

			this.toastService.addToast(`Successfully updated ${this.tournament.name}.`);
		}
		else if (this.isPublishedTournament == true) {
			this.tournamentService.updatePublishedTournament(this.tournament).subscribe(tournament => {
				this.toastService.addToast(`Successfully updated ${tournament.name}.`);
			}, error => {
				this.toastService.addToast(`Unable to update the tournament: ${error.error.message as string}`, ToastType.Error);
			});
		}
	}
}
