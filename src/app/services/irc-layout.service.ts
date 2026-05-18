import { Injectable } from '@angular/core';
import { IrcLayoutSection, IrcLayoutSectionViewType } from '../models/irc-layout-section';
import { IrcLayout } from '../models/irc-layout';
import { BehaviorSubject, filter, map, take } from 'rxjs';
import { IrcLayoutStoreService } from './storage/irc-layout-store.service';

@Injectable({
	providedIn: 'root'
})
export class IrcLayoutService {
	sidebarSections$ = new BehaviorSubject<IrcLayoutSection[]>([]);
	layoutCategories: { name: string; layouts: IrcLayout[] }[];

	readonly hasChanges$ = this.sidebarSections$.pipe(
		map(sections => {
			// Strip .size from coparison
			const noSizeObject = (s: IrcLayoutSection[]) => s.map((({ size: _size, ...rest }) => rest));

			return JSON.stringify(noSizeObject(sections)) !== JSON.stringify(noSizeObject(this.savedSidebarSections));
		})
	);

	private layouts: IrcLayout[] = [
		{ icon: 'list', category: 'general', header: 'irc channels', body: 'Browse and switch between all the IRC channels you have joined.', type: 'irc-channels' },
		{ icon: 'group', category: 'participants', header: 'player management', body: 'See everyone in the lobby. Kick, move players to slots, or pass host directly from this panel - no need to type any commands.', type: 'player-management' },
		{ icon: 'tab', category: 'lobby', header: 'match settings', body: 'A combined panel containing <i>Referee tools</i>, <i>Lobby settings</i>, and <i>Player invitations</i> as three tabs - save sidebar space if you want all three in one place.', type: 'match-settings' },
		{ icon: 'build', category: 'lobby', header: 'referee tools', body: 'Various actions for referees such as synchronizing the match state, managing the lobby and updating the match result to wyBin.', type: 'general-interactions' },
		{ icon: 'settings', category: 'lobby', header: 'lobby settings', body: 'Change team mode (head-to-head, team vs, etc.), win condition (score, accuracy, etc.) and the number of open player slots.', type: 'multiplayer-lobby-settings' },
		{ icon: 'person_add', category: 'participants', header: 'player actions', body: 'Both teams and their players for this match. Invite them to the lobby or send a message to them directly.', type: 'player-invites' },
		{ icon: 'map', category: 'mappool', header: 'mappool', body: 'View the full mappool for this match. Pick or ban maps directly from this panel and keep track of which ', type: 'mappool' }
	];

	private availableId = 0;
	private savedSidebarSections: IrcLayoutSection[] = [];

	constructor(
		private ircLayoutStore: IrcLayoutStoreService
	) {
		this.ircLayoutStore.watchIrcLayoutSections()
			.pipe(
				filter(ircLayoutSections => ircLayoutSections !== null),
				take(1)
			)
			.subscribe(ircLayoutSections => {
				if (ircLayoutSections.length === 0) {
					this.createDefaultSections(false);
					this.commitChanges();
				}
				else {
					this.savedSidebarSections = structuredClone(ircLayoutSections);
					this.sidebarSections$.next(structuredClone(ircLayoutSections));
					this.availableId = this.getNextAvailableId();
				}
			});

		const ircLayoutsMap = new Map<string, IrcLayout[]>();

		for (const layout of this.layouts) {
			ircLayoutsMap.set(layout.category, [...(ircLayoutsMap.get(layout.category) ?? []), layout]);
		}

		this.layoutCategories = Array.from(ircLayoutsMap, ([name, layouts]) => ({
			name,
			layouts
		}));
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
	}

	deleteSection(id: number) {
		this.sidebarSections$.next(this.sidebarSections$.value.filter(section => section.id !== id));
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
	}

	resetToDefault() {
		this.sidebarSections$.next([]);
		this.createDefaultSections();

		this.availableId = this.getNextAvailableId();
	}

	commitChanges() {
		const cloned = structuredClone(this.sidebarSections$.value);

		this.savedSidebarSections = cloned;
		this.sidebarSections$.next(cloned);
		this.ircLayoutStore.saveAllIrcLayoutSections(cloned);
	}

	discardChanges() {
		this.sidebarSections$.next(structuredClone(this.savedSidebarSections));
		this.availableId = this.getNextAvailableId();
	}

	save(sidebarItem: IrcLayoutSection) {
		const allSections = this.sidebarSections$.value;
		const updatedSections = allSections.map(section => section.id === sidebarItem.id ? sidebarItem : section);
		this.sidebarSections$.next(updatedSections);
		this.ircLayoutStore.saveAllIrcLayoutSections(updatedSections);
	}

	getNextAvailableId() {
		const allSections = this.sidebarSections$.value;
		return allSections.length > 0 ? Math.max(...allSections.map(section => section.id)) + 1 : 0;
	}

	getNextAvailableOrder(sidebar: 'left' | 'right') {
		const sidebarSections = this.sidebarSections$.value.filter(section => section.sidebar === sidebar);
		return sidebarSections.length > 0 ? Math.max(...sidebarSections.map(section => section.order)) + 1 : 0;
	}

	private createDefaultSections(save = true) {
		this.createSection(this.availableId++, 0, 'left', 'irc-channels');
		this.createSection(this.availableId++, 1, 'left', 'player-management');
		this.createSection(this.availableId++, 0, 'right', 'match-settings');
		this.createSection(this.availableId++, 1, 'right', 'mappool');

		if (save) {
			this.commitChanges();
		}
	}
}
