import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mappool } from '../../../../models/osu-mappool/mappool';
import { MappoolService } from '../../../../services/mappool.service';
import { ToastService } from '../../../../services/toast.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastType } from 'app/models/toast';

@Component({
	selector: 'app-mappool-edit',
	templateUrl: './mappool-edit.component.html',
	styleUrls: ['./mappool-edit.component.scss']
})

export class MappoolEditComponent implements OnInit {
	publish: any;
	mappool: Mappool;
	validationForm: FormGroup;

	constructor(private route: ActivatedRoute, private mappoolService: MappoolService, private toastService: ToastService) {
		this.route.params.subscribe(params => {
			this.publish = params.publish;

			if (this.publish == true || this.publish == 'true') {
				this.mappoolService.getPublishedMappool(params.mappoolId).subscribe(data => {
					this.mappool = Mappool.serializeJson(data);

					// Set the publish id for published maps
					this.mappool.publishId = this.mappool.id;

					for (const bracket in this.mappool.modBrackets) {
						this.mappool.modBrackets[bracket].collapsed = true;
					}

					this.validationForm = new FormGroup({
						'mappool-description': new FormControl(this.mappool.name, [
							Validators.required
						]),
						'mappool-gamemode': new FormControl(parseInt(<any>this.mappool.gamemodeId), [
							Validators.required
						]),
						'mappool-type': new FormControl(parseInt(<any>this.mappool.mappoolType), [
							Validators.required
						]),
						'mappool-availability': new FormControl(parseInt(<any>this.mappool.availability), [
							Validators.required
						])
					});

					for (let modBracket of this.mappool.modBrackets) {
						this.validationForm.addControl(`mod-bracket-name-${modBracket.id}`, new FormControl(modBracket.bracketName, Validators.required));

						for (let mod of modBracket.mods) {
							this.validationForm.addControl(`mod-bracket-mod-index-${modBracket.validateIndex}-${mod.index}`, new FormControl((mod.modValue == "freemod") ? mod.modValue : parseInt(mod.modValue), Validators.required));
						}
					}

					for (let modCategory of this.mappool.modCategories) {
						this.validationForm.addControl(`category-name-${modCategory.validateIndex}`, new FormControl(modCategory.categoryName, Validators.required));
					}

					this.mappoolService.mappoolLoaded$.next(true);
				});
			}
			else {
				this.mappool = Mappool.makeTrueCopy(mappoolService.getMappool(params.mappoolId));

				for (const bracket in this.mappool.modBrackets) {
					this.mappool.modBrackets[bracket].collapsed = true;
				}

				this.validationForm = new FormGroup({
					'mappool-description': new FormControl(this.mappool.name, [
						Validators.required
					]),
					'mappool-gamemode': new FormControl(parseInt(<any>this.mappool.gamemodeId), [
						Validators.required
					]),
					'mappool-type': new FormControl(parseInt(<any>this.mappool.mappoolType), [
						Validators.required
					]),
					'mappool-availability': new FormControl(parseInt(<any>this.mappool.availability), [
						Validators.required
					])
				});

				this.mappoolService.mappoolLoaded$.next(true);
			}
		});
	}

	ngOnInit(): void { }

	/**
	 * Save the bracket to the mappool
	 * @param bracket the bracket to save
	 */
	updateMappool(mappool: Mappool): void {
		if (this.validationForm.valid) {
			if (this.publish == true || this.publish == 'true') {
				this.mappoolService.updatePublishedMappool(mappool.convertToJson()).subscribe(() => {
					this.toastService.addToast(`Successfully updated the mappool "${mappool.name}".`);
				});
			}
			else {
				this.mappoolService.updateMappool(this.mappool);
				this.toastService.addToast(`Successfully updated the mappool "${mappool.name}".`);
			}
		}
		else {
			this.toastService.addToast(`The mappool wasn't filled in correctly. Look for the marked fields to see what you did wrong.`, ToastType.Warning);
			this.validationForm.markAllAsTouched();
		}
	}
}
