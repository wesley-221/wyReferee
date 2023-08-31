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
			this.loginTutorial(),
			this.tournamentTutorial(),
			// this.createLobbyTutorial(),
			// this.ircTutorial()
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
			content: 'This tutorial will help you login with your osu! account and connect to Bancho using IRC.\n\r' +
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

	/**
	 * The tutorial for importing a tournament
	 */
	private tournamentTutorial(): TutorialCategory {
		const tournamentTutorial = new TutorialCategory({
			name: 'Tournament',
			description: 'This tutorial will help you with figure out how tournaments work.'
		});

		tournamentTutorial.addStep(new TutorialStep({
			route: 'tournament-management/tournament-overview',
			content: 'This tutorial will help you figure out how to view your tournaments as well as how to import them.\n\r' +
				'Click on the arrows on the bottom to navigate through this tutorial.'
		}));

		tournamentTutorial.addStep(new TutorialStep({
			route: 'tournament-management/tournament-overview',
			targetElementIds: [
				'tutorial-local-tournament',
				'tutorial-all-tournaments'
			],
			windowLocation: 'bottom-left',
			content: 'On this page you will see all the tournaments that you have imported. You can click on a tournament to view the selected tournament.\n\r' +
				'_If you see no tournaments on this page, that means you do not have any tournaments imported yet._\n\r' +
				'Tournaments that you see here allow you to create a match that makes use of all the teams, players and mappools of that tournament.\n\r' +
				'If you update a tournament from here, it will not be updated for everyone else that has access to this tournament. This will only change your local copy of the tournament.\n\r' +
				'When an administrator updates the tournament, the changes will automatically be made to this tournament once you restart wyReferee or when you try to create a new multiplayer lobby.'
		}));

		tournamentTutorial.addStep(new TutorialStep({
			route: 'tournament-management/tournament-overview',
			targetElementIds: [
				'tutorial-my-published-tournament',
				'tutorial-all-tournaments'
			],
			windowLocation: 'bottom-left',
			content: 'First click on `my published tournaments`. This will navigate you to the tournaments that you have published yourself. You can click on a tournament to view the selected tournament.\n\r' +
				'_If you see no tournaments on this page, that means you have not published any tournaments yet._\n\r' +
				'If you update a tournament from here, it will be updated for everyone else that has access to this tournament.\n\r' +
				'When a referee that has this tournament imported has wyReferee running, it will not automatically update the tournament. They would have to restart wyReferee or try to create a new multiplayer lobby to download the latest version.'
		}));

		tournamentTutorial.addStep(new TutorialStep({
			route: 'tournament-management/tournament-overview/tournament-all-published',
			targetElementIds: [
				'tutorial-side-bar-all-tournaments',
				'tutorial-all-tournaments'
			],
			content: 'On this page you will see all the tournaments that you have access to. This means a tournament host has given you access to view their tournament. If you do not have permisson to view a tournament, you will not be able to see that tournament in this list.'
		}));

		tournamentTutorial.addStep(new TutorialStep({
			targetElementIds: [
				'tutorial-side-bar-all-tournaments',
				'tutorial-all-tournaments'
			],
			content: 'If you have access to at least one tournament, you will be able to click on the button on the right side of the tournament to import that tournament to your local tournaments.\n\r' +
				'Once you have imported a tournament, you will be able to see the tournament in the `local tournaments` tab.'
		}));

		return tournamentTutorial
	}

	/**
	 * The tutorial for creating a match
	 */
	private createLobbyTutorial(): TutorialCategory {
		const createLobbyTutorial = new TutorialCategory({
			name: 'Creating a match',
			description: 'This tutorial will help you create a new multiplayer lobby.'
		});

		createLobbyTutorial.addStep(new TutorialStep({
			targetElementIds: [],
			content: 'This tutorial has not been made yet.'
		}));

		return createLobbyTutorial
	}

	/**
	 * The tutorial for irc
	 */
	private ircTutorial(): TutorialCategory {
		const ircTutorial = new TutorialCategory({
			name: 'IRC',
			description: 'This tutorial will go over all the functionality for the IRC part of wyReferee.'
		});

		ircTutorial.addStep(new TutorialStep({
			targetElementIds: [],
			content: 'This tutorial has not been made yet.'
		}));

		return ircTutorial
	}
}
