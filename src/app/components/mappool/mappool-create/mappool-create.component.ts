import { Component, OnInit } from '@angular/core';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { MappoolService } from '../../../services/mappool.service';
import { ModBracketMap } from '../../../models/osu-mappool/mod-bracket-map';

@Component({
	selector: 'app-mappool-create',
	templateUrl: './mappool-create.component.html',
	styleUrls: ['./mappool-create.component.scss']
})

export class MappoolCreateComponent implements OnInit {
	creationMappool: Mappool;

	constructor(private mappoolService: MappoolService) { 
		this.creationMappool = mappoolService.creationMappool;
	}

	ngOnInit() { }

	createNewBracket() {
		this.creationMappool.addBracket(new ModBracket());
	}

	addBeatmap(bracket: ModBracket) {
		bracket.addBeatmap(new ModBracketMap());
	}

	removeBeatmap(bracket: ModBracket, beatmap: ModBracketMap) {
		bracket.removeMap(beatmap);
	}

	synchronizeBeatmap(bracket: ModBracket, beatmap: ModBracketMap) {
		console.log(this.creationMappool, bracket, beatmap);
	}
}
