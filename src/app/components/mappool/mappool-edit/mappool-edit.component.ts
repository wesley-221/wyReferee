import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { MappoolService } from '../../../services/mappool.service';
import { ToastService } from '../../../services/toast.service';

@Component({
	selector: 'app-mappool-edit',
	templateUrl: './mappool-edit.component.html',
	styleUrls: ['./mappool-edit.component.scss']
})

export class MappoolEditComponent implements OnInit {
	publish: any;
	mappool: Mappool;

	constructor(private route: ActivatedRoute, private mappoolService: MappoolService, private toastService: ToastService) {
		this.route.params.subscribe(params => {
			this.publish = params.publish;

			if (this.publish == true || this.publish == "true") {
				this.mappoolService.getPublishedMappool(params.mappoolId).subscribe(data => {
					this.mappool = mappoolService.mapFromJson(data);

					for (let bracket in this.mappool.modBrackets) {
						this.mappool.modBrackets[bracket].collapsed = true;
					}
				});
			}
			else {
				this.mappool = Mappool.makeTrueCopy(mappoolService.getMappool(params.mappoolId));

				for (let bracket in this.mappool.modBrackets) {
					this.mappool.modBrackets[bracket].collapsed = true;
				}
			}
		});
	}

	ngOnInit(): void { }

	/**
	 * Save the bracket to the mappool
	 * @param bracket the bracket to save
	 */
	updateMappool(mappool: Mappool) {
		if (this.publish == true || this.publish == "true") {
			this.mappoolService.updatePublishedMappool(this.mappool.convertToJson(true)).subscribe(res => {
				console.log(res);

				this.toastService.addToast(`Successfully updated the mappool "${mappool.name}".`);
			});
		}
		else {
			this.mappoolService.updateMappool(this.mappool);
			this.toastService.addToast(`Successfully updated the mappool "${mappool.name}".`);
		}
	}
}
