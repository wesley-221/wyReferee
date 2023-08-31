export class TutorialStep {
	route: string;
	targetElementIds: string[];
	content: string;

	constructor(init?: Partial<TutorialStep>) {
		this.targetElementIds = [];

		Object.assign(this, init);
	}
}
