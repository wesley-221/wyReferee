import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'app/services/authenticate.service';
import { GenericService } from 'app/services/generic.service';
import { IrcService } from 'app/services/irc.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
	ircConnectionStatus: number;

	allNavigations: { icon: string; header: string; link: string; showIf?: boolean }[] = [
		{ icon: 'info', header: 'information', link: 'information' },
		{ icon: 'settings', header: 'settings', link: 'settings' },
		{ icon: 'dashboard', header: 'management', link: 'tournament-management' },
		{ icon: 'list', header: 'lobby', link: 'lobby-overview' },
		{ icon: 'chat', header: 'irc', link: 'irc' },
		{ icon: 'hdr_auto', header: 'AxS', link: 'axs', showIf: false }
	];

	constructor(private genericService: GenericService, public authenticateService: AuthenticateService, public ircService: IrcService) {
		this.ircConnectionStatus = 0;

		genericService.getAxSMenuStatus().subscribe(active => {
			this.allNavigations[this.allNavigations.length - 1].showIf = active;
		});

		ircService.getIsConnecting().subscribe(status => {
			if (status == true) {
				this.ircConnectionStatus = 1;
			}
			else {
				this.ircConnectionStatus = ircService.isAuthenticated ? 2 : 0;
			}
		});
	}

	ngOnInit() { }
}