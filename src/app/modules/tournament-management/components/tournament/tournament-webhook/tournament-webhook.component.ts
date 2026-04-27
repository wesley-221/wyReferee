import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WyWebhook } from 'app/models/wytournament/wy-webhook';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

@Component({
	selector: 'app-tournament-webhook',
	templateUrl: './tournament-webhook.component.html',
	styleUrls: ['./tournament-webhook.component.scss']
})
export class TournamentWebhookComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	constructor() { }

	ngOnInit(): void { }

	createWebhook(): void {
		this.validationForm.addControl(`webhook-${this.tournament.webhookIndex}-name`, new FormControl('', Validators.required));
		this.validationForm.addControl(`webhook-${this.tournament.webhookIndex}-url`, new FormControl('', Validators.required));

		this.validationForm.addControl(`webhook-${this.tournament.webhookIndex}-match-creation`, new FormControl(false, Validators.required));
		this.validationForm.addControl(`webhook-${this.tournament.webhookIndex}-picks`, new FormControl(false, Validators.required));
		this.validationForm.addControl(`webhook-${this.tournament.webhookIndex}-bans`, new FormControl(true, Validators.required));
		this.validationForm.addControl(`webhook-${this.tournament.webhookIndex}-match-summary`, new FormControl(false, Validators.required));
		this.validationForm.addControl(`webhook-${this.tournament.webhookIndex}-match-result`, new FormControl(true, Validators.required));
		this.validationForm.addControl(`webhook-${this.tournament.webhookIndex}-final-result`, new FormControl(true, Validators.required));

		this.tournament.webhooks.push(new WyWebhook({
			index: this.tournament.webhookIndex
		}));

		this.tournament.webhookIndex++;
	}

	removeWebhook(webhook: WyWebhook): void {
		this.validationForm.removeControl(`webhook-${this.tournament.webhookIndex}-name`);
		this.validationForm.removeControl(`webhook-${this.tournament.webhookIndex}-url`);

		this.validationForm.removeControl(`webhook-${this.tournament.webhookIndex}-match-creation`);
		this.validationForm.removeControl(`webhook-${this.tournament.webhookIndex}-picks`);
		this.validationForm.removeControl(`webhook-${this.tournament.webhookIndex}-bans`);
		this.validationForm.removeControl(`webhook-${this.tournament.webhookIndex}-match-summary`);
		this.validationForm.removeControl(`webhook-${this.tournament.webhookIndex}-match-result`);
		this.validationForm.removeControl(`webhook-${this.tournament.webhookIndex}-final-result`);

		this.tournament.webhooks.splice(this.tournament.webhooks.indexOf(webhook), 1);
	}

	onNameChange(webhook: WyWebhook): void {
		webhook.name = this.validationForm.get(`webhook-${webhook.index}-name`).value;
	}
}
