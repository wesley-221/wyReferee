import { WyModCategory } from './wy-mod-category';

export class WyModBracketMap {
	id: number;
	index: number;
	invalid: boolean;

	beatmapId: number;
	beatmapsetId: number;
	beatmapName: string;
	beatmapUrl: string;

	modifier: number;
	modCategory: WyModCategory;

	picked: boolean;
	isSynchronizing: boolean;

	constructor(init?: Partial<WyModBracketMap>) {
		Object.assign(this, init);
	}

	/**
	 * Create a true copy of the object
	 * @param mod the object to copy
	 */
	public static makeTrueCopy(modBracketMap: WyModBracketMap): WyModBracketMap {
		return new WyModBracketMap({
			id: modBracketMap.id,
			index: modBracketMap.index,
			invalid: modBracketMap.invalid,
			beatmapId: modBracketMap.beatmapId,
			beatmapsetId: modBracketMap.beatmapsetId,
			beatmapName: modBracketMap.beatmapName,
			beatmapUrl: modBracketMap.beatmapUrl,
			modifier: modBracketMap.modifier,
			modCategory: modBracketMap.modCategory != undefined ? WyModCategory.makeTrueCopy(modBracketMap.modCategory) : null,
			picked: modBracketMap.picked,
			isSynchronizing: modBracketMap.isSynchronizing
		});
	}
}
