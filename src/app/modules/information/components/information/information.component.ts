import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'app/services/electron.service';
import { AppConfig } from 'environments/environment';

@Component({
	selector: 'app-information',
	templateUrl: './information.component.html',
	styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
	discordServerLink = AppConfig.links.discordServer;
	githubIssuesLink = AppConfig.links.githubIssues;
	githubWikiLink = AppConfig.links.githubWiki;

	gettingStartedItems = [
		{ title: 'Login', description: 'Connect your osu! account to get started.', 'link-label': 'account', 'link': '/account' },
		{ title: 'Set up Discord webhooks', description: 'Customize how the Discord webhook looks when a match update is being sent.', 'link-label': 'webhooks', 'link': '/webhook' },
		{ title: 'Import or create a tournament', description: 'Import an existing tournament or create a new one to manage.', 'link-label': 'tournaments', 'link': '/tournament-management/tournament-overview' },
		{ title: 'Create a lobby', description: 'Start refereeing - the IRC view handles the rest', 'link-label': 'lobby', 'link': '/lobby-overview' }
	];

	resources = [
		{ title: 'Discord server', description: 'Ask questions, get help', link: this.discordServerLink },
		{ title: 'GitHub issues', description: 'Report bugs, request features', link: this.githubIssuesLink },
		{ title: 'Wiki', description: 'Read documentation, find guides', link: this.githubWikiLink }
	]

	constructor(public electronService: ElectronService) { }
	ngOnInit() { }
}
