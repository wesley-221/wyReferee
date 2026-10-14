import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
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
	activeMappoolIndex: number;

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
		this.activeMappoolIndex = 0;

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
					this.activeMappoolIndex = 0;
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
		this.activeMappoolIndex = this.mappools.length - 1;
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
		this.activeMappoolIndex = this.mappools.length - 1;
	}

	deleteMappool(index: number): void {
		const mappool = new WyMappool(this.mappools.at(index).value);

		const dialogRef = this.dialog.open(DeleteMappoolDialogComponent, {
			data: {
				mappool: mappool
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				this.mappools.removeAt(index);
				if (this.activeMappoolIndex > index) {
					this.activeMappoolIndex--;
				}
				else if (this.activeMappoolIndex === index) {
					this.activeMappoolIndex = Math.min(index, this.mappools.length - 1);
				}

				this.toastService.addToast(`Successfully deleted ${mappool.name}.`);
			}
		});
	}

	selectMappool(index: number): void {
		this.activeMappoolIndex = index;
	}

	moveMappoolEarlier(index: number): void {
		this.moveMappool(index, index - 1);
	}

	moveMappoolLater(index: number): void {
		this.moveMappool(index, index + 1);
	}

	getMappoolFormArray(index: number): FormGroup {
		return this.mappools.at(index);
	}

	private moveMappool(index: number, targetIndex: number): void {
		if (targetIndex < 0 || targetIndex >= this.mappools.length) {
			return;
		}

		const mappool = this.mappools.at(index);
		this.mappools.removeAt(index, { emitEvent: false });
		this.mappools.insert(targetIndex, mappool, { emitEvent: false });
		this.mappools.updateValueAndValidity();
		this.activeMappoolIndex = targetIndex;
	}
}
