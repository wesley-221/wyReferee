import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../../services/authenticate.service';
import { ToastService } from '../../../services/toast.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
	allNavigations: { icon: string; header: string; link: string }[] = [
		{ icon: 'info', header: 'information', link: 'information' },
		{ icon: 'settings', header: 'settings', link: 'settings' },
		{ icon: 'account_circle', header: 'login', link: 'login' },
		{ icon: 'list', header: 'lobby overview', link: 'lobby-overview' },
		{ icon: 'add_circle', header: 'create a lobby', link: 'create-lobby' },
		{ icon: 'map', header: 'mappool', link: 'mappool-overview' },
		{ icon: 'highlight', header: 'tournament', link: 'tournament-overview' },
		{ icon: 'chat', header: 'irc', link: 'irc' }
	];

	constructor(public authService: AuthenticateService, private toastService: ToastService) { }
	ngOnInit() { }
}
