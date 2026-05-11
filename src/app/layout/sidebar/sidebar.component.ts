import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from 'app/services/authenticate.service';
import { GenericService } from 'app/services/generic.service';
import { IrcService } from 'app/services/irc.service';
import { INavigationItem } from '../../interfaces/i-navigation-item';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
	ircConnectionStatus: number;

	allNavigations: INavigationItem[] = [
		{ icon: 'home', header: 'dashboard', link: 'dashboard' },
		{ icon: 'school', header: 'tutorial', link: 'tutorial' },
		{ icon: 'update', header: 'changelog', link: 'changelog' },
		{ type: 'divider' },
		{ icon: 'dashboard', header: 'management', link: 'tournament-management' },
		{ icon: 'schedule', header: 'wyBin schedule', link: 'wybin-schedule' },
		{ icon: 'list', header: 'lobby', link: 'lobby-overview' },
		{ icon: 'chat', header: 'irc', link: 'irc' },
		{ icon: 'hdr_auto', header: 'AxS', link: 'axs', showIf: false }
	];

	allNavigationsFooter: INavigationItem[] = [
		{ icon: 'login', header: 'account', link: 'account' },
		{ icon: 'settings', header: 'settings', link: 'settings' }
	];

	constructor(private genericService: GenericService, public authenticateService: AuthenticateService, public ircService: IrcService, public router: Router, private ref: ChangeDetectorRef) {
		this.ircConnectionStatus = 0;

		this.genericService.getAxSMenuStatus().subscribe(active => {
			for (const item of this.allNavigations) {
				if (item.link == 'axs') {
					item.showIf = active;
				}
			}
		});

		this.ircService.getIsConnecting().subscribe(status => {
			if (status == true) {
				this.ircConnectionStatus = 1;
			}
			else {
				this.ircConnectionStatus = ircService.isAuthenticated ? 2 : 0;
			}
		});
	}

	ngOnInit() {
		this.authenticateService.userLoggedIn().subscribe(loggedIn => {
			if (loggedIn == true) {
				this.ref.detectChanges();
			}
		});
	}
}
