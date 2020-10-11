import { Component, OnInit } from '@angular/core';
import { MappoolService } from '../../../../services/mappool.service';

@Component({
	selector: 'app-mappool-overview',
	templateUrl: './mappool-overview.component.html',
	styleUrls: ['./mappool-overview.component.scss']
})

export class MappoolOverviewComponent implements OnInit {
	constructor(public mappoolService: MappoolService) { }
	ngOnInit() { }
}
