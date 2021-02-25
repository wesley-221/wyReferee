import { Component, OnInit } from '@angular/core';
import { SidebarItem } from 'app/models/sidebar-item';

@Component({
	selector: 'app-axs-router',
	templateUrl: './axs-router.component.html',
	styleUrls: ['./axs-router.component.scss']
})
export class AxsRouterComponent implements OnInit {
	sidebarMenu: SidebarItem[] = [
		new SidebarItem({ name: 'Information', logo: 'map', link: '/axs/information' }),
		new SidebarItem({ name: 'Manual calculation', logo: 'add', link: '/axs/manual-calculator' })
	];

	constructor() { }
	ngOnInit(): void { }
}
