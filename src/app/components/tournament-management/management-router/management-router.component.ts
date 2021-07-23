import { Component, OnInit } from '@angular/core';
import { SidebarItem } from 'app/models/sidebar-item';
import { AuthenticateService } from 'app/services/authenticate.service';

@Component({
	selector: 'app-management-router',
	templateUrl: './management-router.component.html',
	styleUrls: ['./management-router.component.scss']
})
export class ManagementRouterComponent implements OnInit {
	sidebarMenu: SidebarItem[] = [
		// new SidebarItem({ name: 'Mappool', logo: 'map', link: '/tournament-management/mappool-overview' }),
		// new SidebarItem({ name: 'Create', logo: 'add', link: '/tournament-management/mappool-overview/mappool-create', subMenuItem: true }),
		// new SidebarItem({ name: 'My published mappools', logo: 'cloud_upload', link: '/tournament-management/mappool-overview/my-published-mappools', subMenuItem: true, onlyShowAsTournamentHost: true }),
		// new SidebarItem({ name: 'All published mappools', logo: 'cloud_upload', link: '/tournament-management/mappool-overview/all-published-mappools', subMenuItem: true }),

		new SidebarItem({ name: 'Tournament', svgIcon: 'trophy', link: '/tournament-management/tournament-overview' }),
		new SidebarItem({ name: 'Create', logo: 'add', link: '/tournament-management/tournament-overview/tournament-create', subMenuItem: true }),
		new SidebarItem({ name: 'My tournaments', logo: 'cloud_upload', link: '/tournament-management/tournament-overview/tournament-my-published', subMenuItem: true, onlyShowAsTournamentHost: true }),
		new SidebarItem({ name: 'All tournaments', logo: 'cloud_upload', link: '/tournament-management/tournament-overview/tournament-all-published', subMenuItem: true })
	];

	constructor(public authenticateService: AuthenticateService) { }

	ngOnInit(): void { }
}
