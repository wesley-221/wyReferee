import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { WyWebhook } from 'app/models/wytournament/wy-webhook';
import { TournamentEditStateService } from '../../../services/tournament-edit-state.service';
import { debounceTime, filter } from 'rxjs';

@Component({
	selector: 'app-tournament-webhook',
	templateUrl: './tournament-webhook.component.html',
	styleUrls: ['./tournament-webhook.component.scss']
})
export class TournamentWebhookComponent implements OnInit {
	form: FormGroup;

	constructor(
		private tournamentEditStateService: TournamentEditStateService
	) {
		this.form = new FormGroup({
			webhooks: new FormArray([])
		});
	}

	ngOnInit(): void {
		this.tournamentEditStateService.getDraft$()
			.pipe(filter(v => !!v))
			.subscribe(tournament => {
				if (this.webhooks.length === 0) {
					const formArray = new FormArray(
						tournament.webhooks.map(w => this.createWebhookGroup(w))
					);

					this.form.setControl('webhooks', formArray, { emitEvent: false });
				}
				else {
					tournament.webhooks.forEach((cm, i) => {
						this.webhooks.at(i)?.patchValue(cm, { emitEvent: false });
					});
				}
			});

		this.form.valueChanges
			.pipe(debounceTime(200))
			.subscribe(value => {
				this.tournamentEditStateService.updateWebhooksForm(value.webhooks);
			});
	}

	get webhooks(): FormArray {
		return this.form.get('webhooks') as FormArray;
	}

	createWebhook(): void {
		this.webhooks.push(this.createWebhookGroup());
	}

	removeWebhook(index: number): void {
		this.webhooks.removeAt(index);
	}

	private createWebhookGroup(webhook?: WyWebhook): FormGroup {
		return new FormGroup({
			name: new FormControl(webhook?.name || '', Validators.required),
			url: new FormControl(webhook?.url || '', Validators.required),
			matchCreation: new FormControl(webhook?.matchCreation ?? false),
			picks: new FormControl(webhook?.picks ?? false),
			bans: new FormControl(webhook?.bans ?? true),
			matchSummary: new FormControl(webhook?.matchSummary ?? false),
			matchResult: new FormControl(webhook?.matchResult ?? true),
			finalResult: new FormControl(webhook?.finalResult ?? true)
		});
	}
}
