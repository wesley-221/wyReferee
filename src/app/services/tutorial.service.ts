import { Injectable } from '@angular/core';
import { TutorialCategory } from 'app/models/tutorial/tutorial-category';
import { TutorialStep } from 'app/models/tutorial/tutorial-step';

@Injectable({
	providedIn: 'root'
})
export class TutorialService {
	allTutorials: TutorialCategory[];

	currentTutorial: TutorialCategory;
	currentStep: TutorialStep;
	currentStepIndex: number;

	constructor() {
		this.currentTutorial = null;
		this.currentStep = null;
		this.currentStepIndex = 0;

		this.allTutorials = [
			this.loginTutorial()
		];
	}

	/**
	 * Set the current tutorial to the given tutorial
	 *
	 * @param tutorial the tutorial to use
	 */
	setCurrentTutorial(tutorial: TutorialCategory): void {
		this.currentTutorial = tutorial;
		this.currentStepIndex = 0;

		this.currentStep = this.currentTutorial.getSteps()[0];
	}

	/**
	 * Go to the next step from the current tutorial
	 */
	goToNextStep() {
		if (this.currentTutorial == null) {
			return;
		}

		if (this.currentStepIndex < this.currentTutorial.getSteps().length - 1) {
			this.currentStepIndex++;
			this.currentStep = this.currentTutorial.getSteps()[this.currentStepIndex];
		}
	}

	/**
	 * Go to the previous step of the current tutorial;
	 */
	goToPreviousStep() {
		if (this.currentTutorial == null) {
			return;
		}

		if (this.currentStepIndex > 0) {
			this.currentStepIndex--;
			this.currentStep = this.currentTutorial.getSteps()[this.currentStepIndex];
		}
	}
}
