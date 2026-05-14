export type IrcLayoutSectionViewType =
	| 'irc-channels'
	| 'player-management'
	| 'mappool'
	| 'match-settings'
	| 'general-interactions'
	| 'multiplayer-lobby-settings'
	| 'player-invites';

export class IrcLayoutSection {
	id: string | number;
	sidebar: 'left' | 'right';
	order: number;
	size: number;
	minSize?: number;
	maxSize?: number;
	view: IrcLayoutSectionViewType;

	constructor(init: Partial<IrcLayoutSection>) {
		Object.assign(this, init);
	}
}
