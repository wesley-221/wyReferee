import { Injectable } from '@angular/core';
import { IrcLayoutSection, IrcLayoutSectionViewType } from '../models/irc-layout-section';
import { IrcLayout } from '../models/irc-layout';
import { BehaviorSubject, filter, take } from 'rxjs';
import { IrcLayoutStoreService } from './storage/irc-layout-store.service';

@Injectable({
	providedIn: 'root'
})
export class IrcLayoutService {
	sidebarSections$: BehaviorSubject<IrcLayoutSection[]>;

	availableId = 0;

	layouts: IrcLayout[] = [
		{ icon: 'list', header: 'irc channels', body: 'A list with all the irc channels you have joined.', type: 'irc-channels' },
		{ icon: 'group', header: 'player management', body: 'A list with all the players in the multiplayer lobby and allows you to manage them.', type: 'player-management' },
		{ icon: 'tab', header: 'match settings', body: 'A combined group of 3 tabs with general interactions, multiplayer lobby settings and player invitations.', type: 'match-settings' },
		{ icon: 'home', header: 'general interactions', body: 'General interactions', type: 'general-interactions' },
		{ icon: 'settings', header: 'multiplayer lobby settings', body: 'Allows you to change the team mode, win condition and player slots of the multiplayer lobby.', type: 'multiplayer-lobby-settings' },
		{ icon: 'person_add', header: 'player invitation', body: 'A list with all players that are playing for the current match and allows you to invite them to the multiplayer lobby.', type: 'player-invites' },
		{ icon: 'map', header: 'mappool', body: 'A mappool overview of all the maps which allows you to pick or ban them.', type: 'mappool' }
	];

	constructor(
		private ircLayoutStore: IrcLayoutStoreService
	) {
		this.sidebarSections$ = new BehaviorSubject([]);

		this.ircLayoutStore.watchIrcLayoutSections()
			.pipe(
				filter(ircLayoutSections => ircLayoutSections !== null),
				take(1)
			)
			.subscribe(ircLayoutSections => {
				if (ircLayoutSections.length === 0) {
					this.createDefaultSections();
				}
				else {
					this.sidebarSections$.next(ircLayoutSections);
					this.availableId = this.getNextAvailableId();
				}
			});
	}

	createSection(id: number, order: number, sidebar: 'left' | 'right', view: IrcLayoutSectionViewType) {
		let section: IrcLayoutSection;

		if (view === 'irc-channels') {
			section = new IrcLayoutSection({
				id: id,
				order: order,
				sidebar: sidebar,
				size: 250,
				view: 'irc-channels'
			});
		}
		else if (view === 'player-management') {
			section = new IrcLayoutSection({
				id: id,
				order: order,
				sidebar: sidebar,
				view: 'player-management'
			});
		}
		else if (view === 'match-settings') {
			section = new IrcLayoutSection({
				id: id,
				order: order,
				sidebar: sidebar,
				size: 250,
				view: 'match-settings'
			});
		}
		else if (view === 'general-interactions') {
			section = new IrcLayoutSection({
				id: id,
				order: order,
				sidebar: sidebar,
				size: 250,
				view: 'general-interactions'
			});
		}
		else if (view === 'multiplayer-lobby-settings') {
			section = new IrcLayoutSection({
				id: id,
				order: order,
				sidebar: sidebar,
				size: 250,
				view: 'multiplayer-lobby-settings'
			});
		}
		else if (view === 'player-invites') {
			section = new IrcLayoutSection({
				id: id,
				order: order,
				sidebar: sidebar,
				size: 250,
				view: 'player-invites'
			});
		}
		else if (view === 'mappool') {
			section = new IrcLayoutSection({
				id: id,
				order: order,
				sidebar: sidebar,
				view: 'mappool'
			});
		}

		this.sidebarSections$.next([
			...this.sidebarSections$.value,
			section
		]);

		this.saveAllSections();
	}

	deleteSection(id: number) {
		this.sidebarSections$.next(this.sidebarSections$.value.filter(section => section.id !== id));

		this.saveAllSections();
	}

	getLayoutByView(view: IrcLayoutSectionViewType) {
		return this.layouts.find(layout => layout.type === view);
	}

	reorderSections(sidebar: 'left' | 'right', previousIndex: number, currentIndex: number) {
		const allSections = this.sidebarSections$.value;

		const sidebarSections = allSections
			.filter(section => section.sidebar === sidebar)
			.sort((a, b) => a.order - b.order);

		const [movedSection] = sidebarSections.splice(previousIndex, 1);
		sidebarSections.splice(currentIndex, 0, movedSection);

		const updatedSidebarSections = sidebarSections.map((section, index) => ({
			...section,
			order: index
		}));

		this.sidebarSections$.next(
			allSections.map(section => {
				if (section.sidebar !== sidebar) {
					return section;
				}

				return updatedSidebarSections.find(updated => updated.id === section.id) ?? section;
			})
		);

		this.saveAllSections();
	}

	resetToDefault() {
		this.sidebarSections$.next([]);
		this.createDefaultSections();

		this.availableId = this.getNextAvailableId();
	}

	private createDefaultSections() {
		this.createSection(this.availableId++, 0, 'left', 'irc-channels');
		this.createSection(this.availableId++, 1, 'left', 'player-management');
		this.createSection(this.availableId++, 0, 'right', 'match-settings');
		this.createSection(this.availableId++, 1, 'right', 'mappool');

		this.saveAllSections();
	}

	private getNextAvailableId() {
		const allSections = this.sidebarSections$.value;
		return allSections.length > 0 ? Math.max(...allSections.map(section => section.id)) + 1 : 0;
	}

	private saveAllSections() {
		this.ircLayoutStore.saveAllIrcLayoutSections(this.sidebarSections$.value);
	}
}
