import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
	allNavigations: { icon: string; header: string; link: string }[] = [
		{ icon: 'info', header: 'information', link: 'information' },
		{ icon: 'settings', header: 'settings', link: 'settings' },
		{ icon: 'dashboard', header: 'management', link: 'tournament-management' },
		{ icon: 'list', header: 'lobby', link: 'lobby-overview' },
		{ icon: 'chat', header: 'irc', link: 'irc' }
	];

	constructor() { }
	ngOnInit() { }
}
