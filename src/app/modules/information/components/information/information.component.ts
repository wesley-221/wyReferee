import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'app/services/electron.service';
import { AppConfig } from 'environments/environment';

@Component({
	selector: 'app-information',
	templateUrl: './information.component.html',
	styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
	githubIssuesLink = AppConfig.links.githubIssues;
	discordServerLink = AppConfig.links.discordServer;

	constructor(public electronService: ElectronService) { }
	ngOnInit() { }
}
