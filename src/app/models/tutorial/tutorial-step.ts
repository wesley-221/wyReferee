export class TutorialStep {
	route: string;
	targetElementIds: string[];
	content: string;
	action: () => void;

	/**
	 * Currently supported window locations:
	 * - left
	 * - bottom-right
	 * - bottom-left
	 */
	windowLocation: string;

	constructor(init?: Partial<TutorialStep>) {
		this.targetElementIds = [];

		Object.assign(this, init);
	}
}
