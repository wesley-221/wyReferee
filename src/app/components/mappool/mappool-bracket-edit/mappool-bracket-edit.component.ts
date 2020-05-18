import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { MappoolService } from '../../../services/mappool.service';
import { ToastService } from '../../../services/toast.service';
import { GetBeatmap } from '../../../services/osu-api/get-beatmap.service';
import { ElectronService } from '../../../services/electron.service';

@Component({
	selector: 'app-mappool-bracket-edit',
	templateUrl: './mappool-bracket-edit.component.html',
	styleUrls: ['./mappool-bracket-edit.component.scss']
})

export class MappoolBracketEditComponent implements OnInit {
	selectedMappool: Mappool;
	selectedBracket: ModBracket;
	publish: any;

	constructor(private route: ActivatedRoute, private mappoolService: MappoolService, private toastService: ToastService, private getBeatmap: GetBeatmap, public electronService: ElectronService) {
		this.route.params.subscribe(params => {
			this.publish = params.publish;

			if(this.publish == true || this.publish == "true") {
				mappoolService.getPublishedMappool(params.mappoolId).subscribe(data => {
					this.selectedMappool = mappoolService.mapFromJson(data);
					this.selectedBracket = ModBracket.makeTrueCopy(this.selectedMappool.getModBracketByid(params.bracketId));
				});
			}
			else {
				this.selectedMappool = Mappool.makeTrueCopy(mappoolService.getMappool(params.mappoolId));
				this.selectedBracket = ModBracket.makeTrueCopy(this.selectedMappool.getModBracketByid(params.bracketId));
			}
		});
	}

	ngOnInit() { }

	/**
	 * Save the bracket to the mappool
	 * @param bracket the bracket to save
	 */
	saveBracket(bracket: ModBracket) {
		if(this.publish == true || this.publish == "true") {
			for(let countBracket in this.selectedMappool.modBrackets) {
				if(this.selectedMappool.modBrackets[countBracket].id == bracket.id) {
					this.selectedMappool.modBrackets[countBracket] = bracket;
				}
			}

			this.mappoolService.updatePublishedMappool(this.selectedMappool).subscribe(res => {
				this.toastService.addToast(`Successfully updated the bracket "${bracket.bracketName}" from the mappool "${this.selectedMappool.name}".`);
			});
		}
		else {
			for(let countBracket in this.selectedMappool.modBrackets) {
				if(this.selectedMappool.modBrackets[countBracket].id == bracket.id) {
					this.selectedMappool.modBrackets[countBracket] = bracket;
				}
			}

			this.mappoolService.updateMappool(this.selectedMappool);

			this.toastService.addToast(`Successfully updated the bracket "${bracket.bracketName}" from the mappool "${this.selectedMappool.name}".`);
		}
	}
}
