export class TutorialStep {
	route: string;
	targetElementIds: string[];
	content: string;

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
