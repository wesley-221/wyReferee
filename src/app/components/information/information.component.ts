import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'app/services/electron.service';

@Component({
	selector: 'app-information',
	templateUrl: './information.component.html',
	styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
	constructor(public electronService: ElectronService) { }
	ngOnInit() { }
}
