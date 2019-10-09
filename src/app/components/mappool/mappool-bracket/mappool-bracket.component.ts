import { Component, OnInit, Input } from '@angular/core';
import { ModBracket } from '../../../models/osu-mappool/mod-bracket';
import { Mods } from '../../../models/osu-models/osu-api';
import { ElectronService } from '../../../services/electron.service';

@Component({
	selector: 'app-mappool-bracket',
	templateUrl: './mappool-bracket.component.html',
	styleUrls: ['./mappool-bracket.component.scss']
})
export class MappoolBracketComponent implements OnInit {
	@Input() bracket: ModBracket;
	availableMods: string[] = [];

	constructor(public electronService: ElectronService) {
		for(let i in Mods) {
			if(isNaN(Number(i))) {
				this.availableMods.push(i);
			}
		}
	}

	ngOnInit() {}
}
