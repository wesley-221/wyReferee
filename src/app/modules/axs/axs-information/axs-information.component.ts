import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'app/services/electron.service';

@Component({
	selector: 'app-axs-information',
	templateUrl: './axs-information.component.html',
	styleUrls: ['./axs-information.component.scss']
})
export class AxsInformationComponent implements OnInit {
	constructor(public electronService: ElectronService) { }
	ngOnInit(): void { }
}
