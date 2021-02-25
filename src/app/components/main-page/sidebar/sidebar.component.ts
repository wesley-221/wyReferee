import { Component, OnInit } from '@angular/core';
import { GenericService } from 'app/services/generic.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
	allNavigations: { icon: string; header: string; link: string, showIf?: boolean }[] = [
		{ icon: 'info', header: 'information', link: 'information' },
		{ icon: 'settings', header: 'settings', link: 'settings' },
		{ icon: 'dashboard', header: 'management', link: 'tournament-management' },
		{ icon: 'list', header: 'lobby', link: 'lobby-overview' },
		{ icon: 'chat', header: 'irc', link: 'irc' },
		{ icon: 'hdr_auto', header: 'AxS', link: 'axs', showIf: false }
	];

	constructor(private genericService: GenericService) {
		genericService.getAxSMenuStatus().subscribe(active => {
			this.allNavigations[this.allNavigations.length - 1].showIf = active;
		});
	}

	ngOnInit() { }
}
