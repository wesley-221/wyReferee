import { TutorialStep } from "./tutorial-step";

export class TutorialCategory {
	name: string;
	description: string;
	private steps: TutorialStep[];

	constructor(init?: Partial<TutorialCategory>) {
		Object.assign(this, init);
	}

	/**
	 * Add a step to the tutorial
	 *
	 * @param step the step to add
	 */
	addStep(step: TutorialStep): void {
		this.steps.push(step);
	}

	/**
	 * Get all steps from this tutorial
	 */
	getSteps(): TutorialStep[] {
		return this.steps;
	}
}
