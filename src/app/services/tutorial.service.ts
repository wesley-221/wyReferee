import { Injectable } from '@angular/core';
import { TutorialCategory } from 'app/models/tutorial/tutorial-category';
import { TutorialStep } from 'app/models/tutorial/tutorial-step';
import { TournamentService } from './tournament.service';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

import TUTORIAL_TOURNAMENT from 'assets/tutorial-tournament-template.json';

@Injectable({
	providedIn: 'root'
})
export class TutorialService {
	allTutorials: TutorialCategory[];

	currentTutorial: TutorialCategory;
	currentStep: TutorialStep;
	currentStepIndex: number;
	isMinimized: boolean;

	tutorialTournament: WyTournament;

	constructor(private tournamentService: TournamentService) {
		this.currentTutorial = null;
		this.currentStep = null;
		this.currentStepIndex = 0;
		this.isMinimized = false;

		this.allTutorials = [
			this.loginTutorial(),
			this.importTournamentTutorial(),
			// this.createLobbyTutorial(),
			// this.ircTutorial()
		];

		this.tutorialTournament = WyTournament.makeTrueCopy(TUTORIAL_TOURNAMENT as any);
	}

	/**
	 * Set the current tutorial to the given tutorial
	 *
	 * @param tutorial the tutorial to use
	 */
	setCurrentTutorial(tutorial: TutorialCategory): void {
		if (this.currentTutorial && this.currentTutorial.onCloseAction != null) {
			this.currentTutorial.onCloseAction();
		}

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

			if (this.currentStep.action != null) {
				this.currentStep.action();
			}
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

			if (this.currentStep.action != null) {
				this.currentStep.action();
			}
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

			if (this.currentStep.action != null) {
				this.currentStep.action();
			}
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
	 * The tutorial on how to import a tutorial
	 */
	private importTournamentTutorial(): TutorialCategory {
		const importTournamentTutorial = new TutorialCategory({
			name: 'Importing tournaments',
			description: 'This tutorial will help you to figure out how to import a tournament.',
			onCloseAction: () => this.tournamentService.deleteTournament(this.tutorialTournament)
		});

		importTournamentTutorial.addStep(new TutorialStep({
			route: 'tournament-management/tournament-overview',
			content: 'This tutorial will help you to figure out how to import a tournament.\n\r' +
				'Click on the arrows on the bottom to navigate through this tutorial.'
		}));

		importTournamentTutorial.addStep(new TutorialStep({
			route: 'tournament-management/tournament-overview',
			targetElementIds: [
				'tutorial-local-tournament',
				'tutorial-all-tournaments'
			],
			windowLocation: 'bottom-left',
			content: 'On this page you will see all the tournaments that you have imported. You can click on a tournament to view the selected tournament.\n\r' +
				'The tournament called `Tutorial tournament` is an example of what a tournament looks like. **Note**: this tournament will be deleted once this tutorial is done.\n\r' +
				'Tournaments that you see here allow you to create a match that makes use of all the teams, players and mappools of that tournament.\n\r' +
				'When an administrator updates the tournament, the changes will automatically be made to this tournament once you restart wyReferee or when you try to create a new multiplayer lobby.',
			action: () => {
				this.tournamentService.saveTournament(this.tutorialTournament);
			}
		}));

		importTournamentTutorial.addStep(new TutorialStep({
			route: 'tournament-management/tournament-overview/tournament-all-published',
			targetElementIds: [
				'tutorial-all-tournaments',
				'tutorial-side-bar-all-tournaments'
			],
			windowLocation: 'bottom-left',
			content: 'On this page you will see all the tournaments that you have access to. In order to gain access or even be able to see the tournament on this page, you need to be added by an Administrator of the tournament. \n\r' +
				'To import one of the tournaments, all you have to do is click on the button on the right side of the tournament. Once you have pressed on this button, it will appear under the "Local tournaments" on the previous page.\n\r' +
				'You can now start to referee a match using the imported tournament!',
			action: () => {
				this.tournamentService.deleteTournament(this.tutorialTournament);
			}
		}));

		return importTournamentTutorial;
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

		return createLobbyTutorial;
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

		return ircTutorial;
	}
}
