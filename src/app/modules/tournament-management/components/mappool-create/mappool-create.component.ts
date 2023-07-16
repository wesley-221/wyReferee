import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMappoolDialogComponent } from 'app/components/dialogs/delete-mappool-dialog/delete-mappool-dialog.component';
import { WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';

@Component({
	selector: 'app-mappool-create',
	templateUrl: './mappool-create.component.html',
	styleUrls: ['./mappool-create.component.scss']
})
export class MappoolCreateComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	wyBinMappools: WyMappool[];
	importingFromWyBin: boolean;

	constructor(private dialog: MatDialog, private toastService: ToastService, private tournamentService: TournamentService) {
		this.wyBinMappools = [];
		this.importingFromWyBin = false;
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

		this.tournamentService.getWyBinTournamentMappools(this.tournament.wyBinTournamentId).subscribe((mappools: any[]) => {
			mappools.sort((a, b) => a.startDate - b.startDate);

			for (const mappool of mappools) {
				const newMappool = WyMappool.parseFromWyBin(mappool);
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
				for (const findMappool in this.tournament.mappools) {
					if (this.tournament.mappools[findMappool].index == mappool.index) {
						this.tournament.mappools.splice(Number(findMappool), 1);
						break;
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
