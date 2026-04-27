import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMappoolDialogComponent } from 'app/components/dialogs/delete-mappool-dialog/delete-mappool-dialog.component';
import { MappoolType, WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';

@Component({
	selector: 'app-mappool-overview',
	templateUrl: './mappool-overview.component.html',
	styleUrls: ['./mappool-overview.component.scss']
})
export class MappoolOverviewComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	wyBinMappools: WyMappool[];
	importingFromWyBin: boolean;
	addNoFail: boolean;

	constructor(private dialog: MatDialog, private toastService: ToastService, private tournamentService: TournamentService) {
		this.wyBinMappools = [];
		this.importingFromWyBin = false;
		this.addNoFail = true;
	}

	ngOnInit(): void { }

	/**
	 * Create a new mappool
	 */
	createNewMappool(): void {
		const newMappool = new WyMappool({
			index: this.tournament.mappoolIndex,
			name: 'Unnamed mappool'
		});

		this.tournament.mappoolIndex++;

		this.tournament.mappools.push(newMappool);

		this.validationForm.addControl(`mappool-${newMappool.index}-name`, new FormControl('', Validators.required));
		this.validationForm.addControl(`mappool-${newMappool.index}-type`, new FormControl('', Validators.required));
	}

	/**
	 * Import all mappools from wyBin
	 */
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

	/**
	 * Import the selected mappool
	 *
	 * @param mappool the mappool to import
	 */
	importMappool(mappool: WyMappool) {
		const newMappool = WyMappool.makeTrueCopy(mappool);
		newMappool.index = this.tournament.mappoolIndex;
		this.tournament.mappoolIndex++;

		newMappool.collapsed = true;

		this.validationForm.addControl(`mappool-${newMappool.index}-name`, new FormControl(newMappool.name, Validators.required));
		this.validationForm.addControl(`mappool-${newMappool.index}-type`, new FormControl(newMappool.type, Validators.required));

		for (const modBracket of newMappool.modBrackets) {
			modBracket.collapsed = true;

			this.validationForm.addControl(`mappool-${newMappool.index}-mod-bracket-${modBracket.index}-name`, new FormControl(modBracket.name, Validators.required));
			this.validationForm.addControl(`mappool-${newMappool.index}-mod-bracket-${modBracket.index}-acronym`, new FormControl(modBracket.acronym, Validators.required));

			for (const mod of modBracket.mods) {
				if (mod.value != 'freemod') {
					this.validationForm.addControl(`mappool-${newMappool.index}-mod-bracket-${modBracket.index}-mod-${mod.index}-value`, new FormControl(Number(mod.value), Validators.required));
				}
				else {
					this.validationForm.addControl(`mappool-${newMappool.index}-mod-bracket-${modBracket.index}-mod-${mod.index}-value`, new FormControl(mod.value, Validators.required));
				}
			}

			if (mappool.type == MappoolType.AxS) {
				for (const beatmap of modBracket.beatmaps) {
					this.validationForm.addControl(`mappool-${newMappool.index}-mod-bracket-${modBracket.index}-beatmap-${beatmap.index}-modifier`, new FormControl(beatmap.modifier, Validators.required));
				}
			}
		}

		this.tournament.mappools.push(newMappool);
	}

	/**
	 * Delete a mappool
	 *
	 * @param mappool the mappool to delete
	 */
	deleteMappool(mappool: WyMappool): void {
		const dialogRef = this.dialog.open(DeleteMappoolDialogComponent, {
			data: {
				mappool: mappool
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result != null) {
				for (const iMappool in this.tournament.mappools) {
					if (this.tournament.mappools[iMappool].index == mappool.index) {
						const findMappool = this.tournament.mappools[iMappool];

						this.tournament.mappools.splice(Number(iMappool), 1);

						this.validationForm.removeControl(`mappool-${findMappool.index}-name`);
						this.validationForm.removeControl(`mappool-${findMappool.index}-type`);

						for (const modBracket of findMappool.modBrackets) {
							this.validationForm.removeControl(`mappool-${findMappool.index}-mod-bracket-${modBracket.index}-name`);
							this.validationForm.removeControl(`mappool-${findMappool.index}-mod-bracket-${modBracket.index}-acronym`);

							for (const mod of modBracket.mods) {
								this.validationForm.removeControl(`mappool-${findMappool.index}-mod-bracket-${modBracket.index}-mod-${mod.index}-value`);
							}

							if (mappool.type == MappoolType.AxS) {
								for (const beatmap of modBracket.beatmaps) {
									this.validationForm.removeControl(`mappool-${findMappool.index}-mod-bracket-${modBracket.index}-beatmap-${beatmap.index}-modifier`);
								}
							}
						}
					}
				}

				this.toastService.addToast(`Successfully deleted ${mappool.name}.`);
			}
		});
	}

	/**
	 * Collapse the mappool
	 */
	collapseMappool(mappool: WyMappool, event: MouseEvent) {
		if ((event.target as any).localName == 'button' || (event.target as any).localName == 'mat-icon') {
			return;
		}

		mappool.collapsed = !mappool.collapsed;
	}
}
