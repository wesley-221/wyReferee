import { Injectable } from '@angular/core';
import { IrcLayoutSection, IrcLayoutSectionViewType } from '../models/irc-layout-section';
import { IrcLayout } from '../models/irc-layout';

@Injectable({
	providedIn: 'root'
})
export class IrcLayoutService {
	sidebarSections: IrcLayoutSection[];

	layouts: IrcLayout[] = [
		{ icon: 'list', header: 'irc channels', body: 'A list with all the irc channels you have joined.', type: 'irc-channels' },
		{ icon: 'group', header: 'player management', body: 'A list with all the players in the multiplayer lobby and allows you to manage them.', type: 'player-management' },
		{ icon: 'tab', header: 'match settings', body: 'A combined group of 3 tabs with general interactions, multiplayer lobby settings and player invitations.', type: 'match-settings' },
		{ icon: 'home', header: 'general interactions', body: 'General interactions', type: 'general-interactions' },
		{ icon: 'settings', header: 'multiplayer lobby settings', body: 'Allows you to change the team mode, win condition and player slots of the multiplayer lobby.', type: 'multiplayer-lobby-settings' },
		{ icon: 'person_add', header: 'player invitation', body: 'A list with all players that are playing for the current match and allows you to invite them to the multiplayer lobby.', type: 'player-invites' },
		{ icon: 'map', header: 'mappool', body: 'A mappool overview of all the maps which allows you to pick or ban them.', type: 'mappool' }
	];

	constructor() {
		this.sidebarSections = [];

		this.createDefaultSections();
	}

	createSection(id: number | string, order: number, sidebar: 'left' | 'right', view: IrcLayoutSectionViewType) {
		switch (view) {
			case 'irc-channels':
				return new IrcLayoutSection({
					id: id,
					order: order,
					sidebar: sidebar,
					size: 250,
					view: 'irc-channels'
				});

			case 'player-management':
				return new IrcLayoutSection({
					id: id,
					order: order,
					sidebar: sidebar,
					view: 'player-management'
				});

			case 'match-settings':
				return new IrcLayoutSection({
					id: id,
					order: order,
					sidebar: sidebar,
					size: 250,
					view: 'match-settings'
				});

			case 'general-interactions':
				return new IrcLayoutSection({
					id: id,
					order: order,
					sidebar: sidebar,
					size: 250,
					view: 'general-interactions'
				});

			case 'multiplayer-lobby-settings':
				return new IrcLayoutSection({
					id: id,
					order: order,
					sidebar: sidebar,
					size: 250,
					view: 'multiplayer-lobby-settings'
				});

			case 'player-invites':
				return new IrcLayoutSection({
					id: id,
					order: order,
					sidebar: sidebar,
					size: 250,
					view: 'player-invites'
				});

			case 'mappool':
				return new IrcLayoutSection({
					id: id,
					order: order,
					sidebar: sidebar,
					view: 'mappool'
				});
		}
	}

	private createDefaultSections() {
		this.sidebarSections = [
			this.createSection(0, 0, 'left', 'irc-channels'),
			this.createSection(1, 1, 'left', 'player-management'),
			this.createSection(2, 0, 'right', 'match-settings'),
			this.createSection(3, 1, 'right', 'mappool')
		];
	}
}
