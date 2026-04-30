import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MappoolType } from 'app/models/wytournament/mappool/wy-mappool';
import { TournamentConditionalMessageForm } from '../../../interfaces/tournament-conditional-messages-form.interface';
import { TournamentEditStateService } from '../../../services/tournament-edit-state.service';
import { debounceTime, filter } from 'rxjs';

@Component({
	selector: 'app-tournament-conditional-message',
	templateUrl: './tournament-conditional-message.component.html',
	styleUrls: ['./tournament-conditional-message.component.scss']
})
export class TournamentConditionalMessageComponent implements OnInit {
	form: FormGroup;

	hasCTMMappool: boolean;

	constructor(
		private tournamentEditStateService: TournamentEditStateService
	) {
		this.hasCTMMappool = false;

		this.form = new FormGroup({
			conditionalMessages: new FormArray([])
		})
	}

	ngOnInit(): void {
		this.tournamentEditStateService.getDraft$()
			.pipe(
				filter(v => !!v)
			)
			.subscribe(tournament => {
				if (this.conditionalMessages.length === 0) {
					const formArray = new FormArray(
						tournament.conditionalMessages.map(cm => this.createConditionalMessageGroup(cm))
					);

					this.form.setControl('conditionalMessages', formArray, { emitEvent: false });
				}
				else {
					tournament.conditionalMessages.forEach((cm, i) => {
						this.conditionalMessages.at(i)?.patchValue(cm, { emitEvent: false });
					});
				}

				this.hasCTMMappool = tournament.mappools?.some(m => m.type == MappoolType.CTMTournament) ?? false;
			});

		this.form.valueChanges
			.pipe(debounceTime(200))
			.subscribe(value => {
				this.tournamentEditStateService.updateConditionalMessagesForm(value.conditionalMessages);
			});
	}

	get conditionalMessages(): FormArray {
		return this.form.get('conditionalMessages') as FormArray;
	}

	createNewMessage(): void {
		this.conditionalMessages.push(this.createConditionalMessageGroup());
	}

	removeConditionalMessage(index: number) {
		this.conditionalMessages.removeAt(index);
	}

	toggleOption(group: AbstractControl, option: string): void {
		const control = group.get(option);
		control?.setValue(!control.value);
	}

	private createConditionalMessageGroup(message?: TournamentConditionalMessageForm): FormGroup {
		return new FormGroup({
			message: new FormControl(message?.message || '', Validators.required),
			beatmapResult: new FormControl(message?.beatmapResult ?? false),
			beatmapPicked: new FormControl(message?.beatmapPicked ?? false),
			nextPickMessage: new FormControl(message?.nextPickMessage ?? false),
			nextPickTiebreakerMessage: new FormControl(message?.nextPickTiebreakerMessage ?? false),
			matchWonMessage: new FormControl(message?.matchWonMessage ?? false)
		});
	}
}
