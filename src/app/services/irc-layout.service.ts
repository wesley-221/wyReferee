import { Injectable } from '@angular/core';
import { IrcLayoutSection } from '../models/irc-layout-section';

@Injectable({
	providedIn: 'root'
})
export class IrcLayoutService {
	sidebarLeftSections: IrcLayoutSection[];
	sidebarRightSections: IrcLayoutSection[];

	constructor() {
		this.sidebarLeftSections = [];
		this.sidebarRightSections = [];

		this.createDefaultSections();
	}

	private createDefaultSections() {
		const lobbySection = new IrcLayoutSection({
			id: 0,
			order: 0,
			sidebar: 'left',
			size: 250,
			view: 'lobbies'
		});

		const playerManagementSection = new IrcLayoutSection({
			id: 1,
			order: 1,
			sidebar: 'left',
			view: 'player-management'
		});

		const matchSettingsSection = new IrcLayoutSection({
			id: 2,
			order: 0,
			sidebar: 'right',
			size: 250,
			view: 'match-settings'
		});

		const mappoolSection = new IrcLayoutSection({
			id: 3,
			order: 1,
			sidebar: 'right',
			view: 'mappool'
		});

		this.sidebarLeftSections = [lobbySection, playerManagementSection];
		this.sidebarRightSections = [matchSettingsSection, mappoolSection];
	}
}
