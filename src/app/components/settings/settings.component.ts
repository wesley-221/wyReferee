import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../services/electron.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
	constructor(private electronService: ElectronService) { }
	ngOnInit() { }
}
