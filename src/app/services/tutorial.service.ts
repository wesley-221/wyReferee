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
	isMinimized: boolean;

	constructor() {
		this.currentTutorial = null;
		this.currentStep = null;
		this.currentStepIndex = 0;
		this.isMinimized = false;

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
		this.isMinimized = false;

		if (tutorial != null) {
		this.currentStep = this.currentTutorial.getSteps()[0];
	}
	}

	/**
	 * Go to the page by the given index
	 *
	 * @param index the index of the page to go to
	 */
	goToPage(index: number) {
		if (this.currentTutorial == null) {
			return;
		}

		this.currentStepIndex = index;
		const steps = this.currentTutorial.getSteps();

		if (this.currentStepIndex >= 0 && this.currentStepIndex < this.currentTutorial.getSteps().length) {
			this.currentStep = steps[this.currentStepIndex];
		}
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

	/**
	 * The tutorial for login in
	 */
	private loginTutorial(): TutorialCategory {
		const loginTutorial = new TutorialCategory({
			name: 'Login',
			description: 'This tutorial will help you login to the client.'
		});

		loginTutorial.addStep(new TutorialStep({
			route: 'settings',
			content: 'This quick tutorial will help you login with your osu! account and connect to Bancho using IRC.\n\r' +
				'Click on the arrows on the bottom to navigate through this tutorial.'
		}));

		loginTutorial.addStep(new TutorialStep({
			route: 'settings',
			targetElementIds: [
				'tutorial-api-key',
				'tutorial-api-key-input'
			],
			content: 'First off, we have to enter an api key. To get your api key, you can click [here](https://osu.ppy.sh/home/account/edit#legacy-api).\n\r' +
				'Create a new api key if you have no api key yet. For the application url you can simply enter anything.\n\r' +
				'Now that you have an api key, you are gonna have to copy this key and paste it in the highlighted field and click on Save.\n\r' +
				'If your api key was correct, the highlighted area should dissapear and you can continue to the next step.'
		}));

		loginTutorial.addStep(new TutorialStep({
			route: 'settings',
			targetElementIds: [
				'tutorial-login-irc'
			],
			windowLocation: 'left',
			content: 'Now we are gonna connect with IRC so we can actually communicate with Bancho.\n\r' +
				'The username and password for IRC is different from your normal osu! account details. To get your login details for IRC, you can click [here](https://osu.ppy.sh/home/account/edit#legacy-api).\n\r' +
				'On the page that just opened you will see a `username` and a `server password`. Now copy and paste the `username` and `password` to wyReferee and click on Connect.\n\r' +
				'You will now be logged in to IRC and are able to communicate with Bancho. You can now continue to the next step.'
		}));

		loginTutorial.addStep(new TutorialStep({
			route: 'settings',
			targetElementIds: [
				'tutorial-login-osu-oauth'
			],
			content: '**This is the final step of this tutorial. Make sure to read through this all first before continueing. Because of how login in works this tutorial will close right after you login and wont reopen.**\n\r' +
				'---\n\r' +
				'When you click on Login, a new window will pop up. This window will ask you to login with your osu! details. Enter your osu! details here.\n\r' +
				'Once you are logged in, osu! will ask you if you want to authorize wyReferee for certain permissions. Click on Authorize to grant the permissions.\m\r' +
				'Once you have clicked on Authorize, wyReferee will refresh and you will be logged in.\n\r' +
				'This tutorial will be automatically closed and you will be all setup to use the client to its fullest potential!'
		}));

		return loginTutorial;
	}
}
