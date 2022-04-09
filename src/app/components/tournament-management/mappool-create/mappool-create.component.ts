import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMappoolDialogComponent } from 'app/components/dialogs/delete-mappool-dialog/delete-mappool-dialog.component';
import { WyMappool } from 'app/models/wytournament/mappool/wy-mappool';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { ToastService } from 'app/services/toast.service';

export interface IMappoolDialogData {
	mappool: WyMappool;
}
@Component({
	selector: 'app-mappool-create',
	templateUrl: './mappool-create.component.html',
	styleUrls: ['./mappool-create.component.scss']
})
export class MappoolCreateComponent implements OnInit {
	@Input() tournament: WyTournament;
	@Input() validationForm: FormGroup;

	constructor(private dialog: MatDialog, private toastService: ToastService) { }

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
					if (this.tournament.mappools[findMappool].id == mappool.id) {
						this.tournament.mappools.splice(Number(findMappool), 1);
						break;
					}
				}

				this.toastService.addToast(`Successfully deleted ${mappool.name}.`);
			}
		});
	}
}
