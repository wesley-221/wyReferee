import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Mods } from 'app/models/osu-models/osu';
import { WyConditionalMessage } from 'app/models/wytournament/wy-conditional-message';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ValidationErrorService } from 'app/modules/tournament-management/services/validation-error.service';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';

@Component({
	selector: 'app-tournament-create',
	templateUrl: './tournament-create.component.html',
	styleUrls: ['./tournament-create.component.scss']
})
export class TournamentCreateComponent implements OnInit {
	@ViewChild('container') container: ElementRef;

	tournament: WyTournament;
	validationForm: FormGroup;

	errors: string[];

	constructor(private toastService: ToastService, private tournamentService: TournamentService, private validationErrorService: ValidationErrorService) {
		this.tournament = new WyTournament();
		this.errors = [];

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
			'tournament-protects': new FormControl('', [
				Validators.required
			]),
			'tournament-format': new FormControl('', [
				Validators.required
			]),
			'tournament-team-size': new FormControl('', [
				Validators.required,
				Validators.min(1),
				Validators.max(8)
			]),
			'default-team-mode': new FormControl(0, Validators.required),
			'default-win-condition': new FormControl(0, Validators.required),
			'default-players': new FormControl(8, Validators.required),
			'allow-double-pick': new FormControl(true),
			'invalidate-beatmaps': new FormControl(true),
			'lobby-team-name-with-brackets': new FormControl(false)
		});

		const conditionalMessages = [
			new WyConditionalMessage({ index: this.tournament.conditionalMessageIndex++, message: '{{ beatmapWinner }} has won on {{ beatmap }}', beatmapResult: true }),
			new WyConditionalMessage({ index: this.tournament.conditionalMessageIndex++, message: 'Score: {{ beatmapTeamOneScore }} - {{ beatmapTeamTwoScore }} | score difference : {{ scoreDifference }}', beatmapResult: true }),
			new WyConditionalMessage({ index: this.tournament.conditionalMessageIndex++, message: '{{ teamOneName }} | {{ matchTeamOneScore }} : {{ matchTeamTwoScore }} | {{ teamTwoName }}', beatmapResult: true }),
			new WyConditionalMessage({ index: this.tournament.conditionalMessageIndex++, message: 'Next pick is for {{ nextPick }}', beatmapResult: true, nextPickMessage: true }),
			new WyConditionalMessage({ index: this.tournament.conditionalMessageIndex++, message: 'The next pick is the tiebreaker!', beatmapResult: true, nextPickTiebreakerMessage: true }),
			new WyConditionalMessage({ index: this.tournament.conditionalMessageIndex++, message: '!mp aborttimer', beatmapPicked: true }),
			new WyConditionalMessage({ index: this.tournament.conditionalMessageIndex++, message: '!mp timer 120', beatmapPicked: true }),
			new WyConditionalMessage({ index: this.tournament.conditionalMessageIndex++, message: '{{ matchWinner }} has won the match, GG and WP!', beatmapResult: true, matchWonMessage: true })
		];

		for (const beatmapResultMessage of conditionalMessages) {
			this.validationForm.addControl(`conditional-message-${beatmapResultMessage.index}`, new FormControl(beatmapResultMessage.message, Validators.required));

			this.tournament.conditionalMessages.push(beatmapResultMessage);
		}
	}

	ngOnInit(): void { }

	createTournament(): void {
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

		this.tournament.defaultTeamMode = this.validationForm.get('default-team-mode').value;
		this.tournament.defaultWinCondition = this.validationForm.get('default-win-condition').value;
		this.tournament.defaultPlayers = this.validationForm.get('default-players').value;

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

		this.tournamentService.saveTournament(this.tournament);

		this.toastService.addToast('Successfully created the tournament.');
	}
}
