import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMappoolDialogComponent } from 'app/components/dialogs/delete-mappool-dialog/delete-mappool-dialog.component';
import { MappoolType, WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { TournamentEditStateService } from '../../../../services/tournament-edit-state.service';
import { debounceTime, filter } from 'rxjs';
import { FormGroupHelper } from '../../../../models/form-group-helper';

@Component({
	selector: 'app-mappool-overview',
	templateUrl: './mappool-overview.component.html',
	styleUrls: ['./mappool-overview.component.scss']
})
export class MappoolOverviewComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	form: FormGroup;
	collapsedState: WeakMap<AbstractControl, boolean>;

	wyBinMappools: WyMappool[];
	importingFromWyBin: boolean;
	addNoFail: boolean;

	constructor(
		private dialog: MatDialog,
		private toastService: ToastService,
		private tournamentService: TournamentService,
		private tournamentEditStateService: TournamentEditStateService
	) {
		this.wyBinMappools = [];
		this.importingFromWyBin = false;
		this.addNoFail = true;
		this.collapsedState = new WeakMap<AbstractControl, boolean>();

		this.form = new FormGroup({
			mappools: new FormArray([])
		});
	}

	ngOnInit(): void {
		this.tournamentEditStateService.getDraft$()
			.pipe(filter(v => !!v))
			.subscribe(tournament => {
				this.tournament = tournament;

				if (this.mappools.length === 0) {
					const formArray = new FormArray(
						tournament.mappools.map(m => FormGroupHelper.createMappoolFormGroup(m))
					);

					this.form.setControl('mappools', formArray, { emitEvent: false });
				}
				else {
					tournament.mappools.forEach((m, i) => {
						this.mappools.at(i)?.patchValue(m, { emitEvent: false });
					});
				}
			});

		this.form.valueChanges
			.pipe(debounceTime(200))
			.subscribe(value => {
				this.tournamentEditStateService.updateMappoolForm(value.mappools);
			});
	}

	get mappools(): FormArray<FormGroup> {
		return this.form.get('mappools') as FormArray<FormGroup>;
	}

	createNewMappool(): void {
		const newMappool = new WyMappool();

		this.mappools.push(FormGroupHelper.createMappoolFormGroup(newMappool));
	}

	importWyBinMappool(): void {
		this.wyBinMappools = [];

		this.importingFromWyBin = true;

		this.tournamentService.getWyBinTournamentMappools(this.tournament.wyBinTournamentId).subscribe((tournament: any) => {
			tournament.stages.sort((a, b) => a.startDate - b.startDate);

			for (const stage of tournament.stages) {
				for (const modBracket of stage.modBrackets) {
					modBracket.beatmaps.sort((a: any, b: any) => a.beatmapOrder - b.beatmapOrder);
				}

				const newMappool = WyMappool.parseFromWyBin(stage, this.addNoFail, this.tournament.gamemodeId);

				if (tournament.axsTournament == true) {
					newMappool.type = MappoolType.AxS;
				}

				this.wyBinMappools.push(newMappool);
			}

			this.importingFromWyBin = false;
		});
	}

	importMappool(mappool: WyMappool) {
		const newMappool = WyMappool.makeTrueCopy(mappool);
		newMappool.index = this.tournament.mappoolIndex;

		this.mappools.push(FormGroupHelper.createMappoolFormGroup(newMappool));
	}

	deleteMappool(index: number): void {
		const mappool = this.tournament.mappools[index];

		const dialogRef = this.dialog.open(DeleteMappoolDialogComponent, {
			data: {
				mappool: mappool
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.mappools.removeAt(index);

				this.toastService.addToast(`Successfully deleted ${mappool.name}.`);
			}
		});
	}

	collapseMappool(mappool: AbstractControl, event: MouseEvent): void {
		if ((event.target as HTMLElement).closest('button')) {
			return;
		}

		const currentState = this.collapsedState.get(mappool) ?? true;
		this.collapsedState.set(mappool, !currentState);
	}

	getMappoolFormArray(index: number): FormGroup {
		return this.mappools.at(index);
	}
}
