import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'app/services/authenticate.service';

class SidebarItem {
	name: string;
	logo: string;
	svgIcon: string;
	link: string;
	subMenuItem: boolean;
	onlyShowAsTournamentHost: boolean;

	constructor(init?: Partial<SidebarItem>) {
		Object.assign(this, init);
	}
}

@Component({
	selector: 'app-management-router',
	templateUrl: './management-router.component.html',
	styleUrls: ['./management-router.component.scss']
})
export class ManagementRouterComponent implements OnInit {
	sidebarMenu: SidebarItem[] = [
		new SidebarItem({ name: 'Mappool', logo: 'map', link: '/tournament-management/mappool-overview' }),
		new SidebarItem({ name: 'Create', logo: 'add', link: '/tournament-management/mappool-overview/mappool-create', subMenuItem: true }),
		new SidebarItem({ name: 'My published mappools', logo: 'cloud_upload', link: '/tournament-management/mappool-overview/my-published-mappools', subMenuItem: true, onlyShowAsTournamentHost: true }),
		new SidebarItem({ name: 'All published mappools', logo: 'cloud_upload', link: '/tournament-management/mappool-overview/all-published-mappools', subMenuItem: true }),

		new SidebarItem({ name: 'Tournament', svgIcon: 'trophy', link: '/tournament-management/tournament-overview' }),
		new SidebarItem({ name: 'Create', logo: 'add', link: '/tournament-management/tournament-overview/tournament-create', subMenuItem: true }),
		new SidebarItem({ name: 'My published tournaments', logo: 'cloud_upload', link: '/tournament-management/tournament-overview/my-published-tournaments', subMenuItem: true, onlyShowAsTournamentHost: true }),
		new SidebarItem({ name: 'All published tournaments', logo: 'cloud_upload', link: '/tournament-management/tournament-overview/all-published-tournaments', subMenuItem: true })
	];

	constructor(public authenticateService: AuthenticateService) { }

	ngOnInit(): void { }
}
