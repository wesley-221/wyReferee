import { Component, OnInit } from '@angular/core';
import { ModBracket } from '../../../../models/osu-mappool/mod-bracket';
import { Mappool } from '../../../../models/osu-mappool/mappool';
import { MappoolService } from '../../../../services/mappool.service';
import { GetBeatmap } from '../../../../services/osu-api/get-beatmap.service';
import { ElectronService } from '../../../../services/electron.service';
import { ToastService } from '../../../../services/toast.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastType } from 'app/models/toast';

@Component({
	selector: 'app-mappool-create',
	templateUrl: './mappool-create.component.html',
	styleUrls: ['./mappool-create.component.scss']
})

export class MappoolCreateComponent implements OnInit {
	creationMappool: Mappool;
	validationForm: FormGroup;

	constructor(public electronService: ElectronService, private mappoolService: MappoolService, private getBeatmap: GetBeatmap, private toastService: ToastService) {
		this.creationMappool = mappoolService.creationMappool;
		this.creationMappool.id = mappoolService.availableMappoolId;

		this.mappoolService.mappoolLoaded$.next(true);

		this.validationForm = new FormGroup({
			'mappool-description': new FormControl('', [
				Validators.required
			]),
			'mappool-gamemode': new FormControl('', [
				Validators.required
			]),
			'mappool-type': new FormControl('', [
				Validators.required
			]),
			'mappool-availability': new FormControl('', [
				Validators.required
			])
		});
	}

	ngOnInit() { }

	/**
	 * Create a new bracket
	 */
	createNewBracket() {
		this.creationMappool.addBracket(new ModBracket());
	}

	/**
	 * Create the mappool from the creationMappool object
	 */
	createMappool() {
		if (this.validationForm.valid) {
			this.mappoolService.saveMappool(this.creationMappool);
			this.toastService.addToast(`Successfully created the mappool "${this.creationMappool.name}"!`);
		}
		else {
			this.toastService.addToast(`The mappool wasn't filled in correctly. Look for the marked fields to see what you did wrong.`, ToastType.Warning);
			this.validationForm.markAllAsTouched();
		}
	}

	/**
	 * Change the gamemode of the mappool
	 */
	changeGamemode(event) {
		this.creationMappool.gamemodeId = event.target.value;
	}
}
