import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MappoolType } from 'app/models/wytournament/mappool/wy-mappool';
import { TournamentTriggerMessageForm } from '../../../interfaces/tournament-trigger-messages-form.interface';
import { TournamentEditStateService } from '../../../services/tournament-edit-state.service';
import { debounceTime, filter } from 'rxjs';

@Component({
	selector: 'app-tournament-trigger-message',
	templateUrl: './tournament-trigger-message.component.html',
	styleUrls: ['./tournament-trigger-message.component.scss']
})
export class TournamentTriggerMessageComponent implements OnInit {
	form: FormGroup;

	hasCTMMappool: boolean;

	constructor(
		private tournamentEditStateService: TournamentEditStateService
	) {
		this.hasCTMMappool = false;

		this.form = new FormGroup({
			triggerMessages: new FormArray([])
		})
	}

	ngOnInit(): void {
		this.tournamentEditStateService.getDraft$()
			.pipe(
				filter(v => !!v)
			)
			.subscribe(tournament => {
				if (this.triggerMessages.length === 0) {
					const formArray = new FormArray(
						tournament.triggerMessages.map(cm => this.createTriggerMessageGroup(cm))
					);

					this.form.setControl('triggerMessages', formArray, { emitEvent: false });
				}
				else {
					tournament.triggerMessages.forEach((cm, i) => {
						this.triggerMessages.at(i)?.patchValue(cm, { emitEvent: false });
					});
				}

				this.hasCTMMappool = tournament.mappools?.some(m => m.type == MappoolType.CTMTournament) ?? false;
			});

		this.form.valueChanges
			.pipe(debounceTime(200))
			.subscribe(value => {
				this.tournamentEditStateService.updateTriggerMessagesForm(value.triggerMessages);
			});
	}

	get triggerMessages(): FormArray {
		return this.form.get('triggerMessages') as FormArray;
	}

	createNewMessage(): void {
		this.triggerMessages.push(this.createTriggerMessageGroup());
	}

	removeTriggerMessage(index: number) {
		this.triggerMessages.removeAt(index);
	}

	toggleOption(group: AbstractControl, option: string): void {
		const control = group.get(option);
		control?.setValue(!control.value);
	}

	private createTriggerMessageGroup(message?: TournamentTriggerMessageForm): FormGroup {
		return new FormGroup({
			id: new FormControl(message?.id || null),
			message: new FormControl(message?.message || '', Validators.required),
			beatmapResult: new FormControl(message?.beatmapResult ?? false),
			beatmapPicked: new FormControl(message?.beatmapPicked ?? false),
			nextPickMessage: new FormControl(message?.nextPickMessage ?? false),
			nextPickTiebreakerMessage: new FormControl(message?.nextPickTiebreakerMessage ?? false),
			matchWonMessage: new FormControl(message?.matchWonMessage ?? false)
		});
	}
}
