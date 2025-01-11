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
		new SidebarItem({ name: 'Tournament', svgIcon: 'trophy', link: '/tournament-management/tournament-overview' }),
		new SidebarItem({ name: 'Create', logo: 'add', link: '/tournament-management/tournament-overview/tournament-create', subMenuItem: true }),
		new SidebarItem({ name: 'All tournaments', htmlElementId: 'tutorial-side-bar-all-tournaments', logo: 'cloud_upload', link: '/tournament-management/tournament-overview/tournament-all-published', subMenuItem: true, onlyShowWhenLoggedIn: true }),
		new SidebarItem({ name: 'Administrator', logo: 'admin_panel_settings', link: '/tournament-management/tournament-overview/tournament-all-published-administrator', subMenuItem: true, onlyShowAsAdministrator: true })
	];

	constructor(public authenticateService: AuthenticateService) { }

	ngOnInit(): void { }
}
