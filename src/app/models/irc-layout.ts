import { IrcLayoutSectionViewType } from "./irc-layout-section";

export interface IrcLayout {
	icon: string;
	header: string;
	body: string;
	type: IrcLayoutSectionViewType;
	category: 'general' | 'lobby' | 'mappool' | 'participants';
}
