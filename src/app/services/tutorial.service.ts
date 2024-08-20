import { Injectable } from '@angular/core';
import { TutorialCategory } from 'app/models/tutorial/tutorial-category';
import { TutorialStep } from 'app/models/tutorial/tutorial-step';
import { TournamentService } from './tournament.service';
import { WyTournament } from 'app/models/wytournament/wy-tournament';

import TUTORIAL_TOURNAMENT from 'assets/tutorial-tournament-template.json';
import { StoreService } from './store.service';

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

	constructor(private tournamentService: TournamentService, private storeService: StoreService) {
		this.currentTutorial = null;
		this.currentStep = null;
		this.currentStepIndex = 0;
		this.isMinimized = false;

		this.allTutorials = [
			this.loginTutorial(),
			this.importTournamentTutorial(),
			this.createLobbyTutorial(),
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

			if (this.currentStep.action != null) {
				this.currentStep.action();
			}
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

		let apiKeyStepContent = 'First off, we have to enter an api key. To get your api key, you can click [here](https://osu.ppy.sh/home/account/edit#legacy-api).\n\r' +
			'Create a new api key if you have no api key yet. For the application url you can simply enter anything.\n\r' +
			'Now that you have an api key, you are gonna have to copy this key and paste it in the highlighted field and click on Save.\n\r' +
			'If your api key was correct, the highlighted area should dissapear and you can continue to the next step.';

		if (this.storeService.get('api-key') != undefined) {
			apiKeyStepContent = '**You have already setup the api key. You can continue to the next step.**\n\n---\n\r' + apiKeyStepContent;
		}

		loginTutorial.addStep(new TutorialStep({
			route: 'authentication',
			content: 'This tutorial will help you login with your osu! account and connect to Bancho using IRC.\n\r' +
				'Click on the arrows on the bottom to navigate through this tutorial.'
		}));

		loginTutorial.addStep(new TutorialStep({
			route: 'authentication',
			targetElementIds: [
				'tutorial-api-key',
				'tutorial-api-key-input'
			],
			content: apiKeyStepContent
		}));

		loginTutorial.addStep(new TutorialStep({
			route: 'authentication',
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
			route: 'authentication',
			targetElementIds: [
				'tutorial-login-osu-oauth'
			],
			content: 'When you click on Login, a new window will pop up. This window will ask you to login with your osu! details. Enter your osu! details here.\n\r' +
				'Once you are logged in, osu! will ask you if you want to authorize wyReferee for "Read public data" permissions. Click on Authorize to grant the permissions.\n\r' +
				'Once you have clicked on Authorize, wyReferee will now log you in.\n\r' +
				'You are now all setup to use wyReferee to its fullest potential!'
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
			name: 'Creating a multiplayer lobby',
			description: 'This tutorial will help you create a new multiplayer lobby.'
		});

		createLobbyTutorial.addStep(new TutorialStep({
			route: 'lobby-overview',
			content: 'This tutorial will help you create a new multiplayer lobby.\n\r' +
				'Click on the arrows on the bottom to navigate through this tutorial.',
			action: () => {
				this.tournamentService.saveTournament(this.tutorialTournament);
			}
		}));

		createLobbyTutorial.addStep(new TutorialStep({
			route: 'lobby-overview',
			targetElementIds: [
				'tutorial-create-new-multiplayer-lobby'
			],
			content: 'On this page you will see all the multiplayer lobbies you have created. We are gonna be making a multiplayer lobby first, you can do this by clicking on the `create new Multiplayer lobby` button. \n\rOnce you have clicked on the button, you can go to the next step.'
		}));

		createLobbyTutorial.addStep(new TutorialStep({
			route: 'lobby-overview/create-lobby',
			targetElementIds: [
				'tutorial-tournament-acronym'
			],
			content: 'As you might have noticed, we are skipping the `Select a tournament` dropdown. This is intentional and we will go back to this dropdown after the next few steps.\n\r' +
				'The next 3 steps can be skipped if you are gonna be selecting a tournament, as these 3 steps will not be relevant for you.\n\r' +
				'---\n\r' +
				'The tournament acronym is exactly what you would assume it is, it is the acronym used to create the multiplayer lobby.'
		}));

		createLobbyTutorial.addStep(new TutorialStep({
			route: 'lobby-overview/create-lobby',
			targetElementIds: [
				'tutorial-score-system'
			],
			content: 'The score system determines how scores are calculated when a beatmap has been played. If a normal tournament is being hosted, `Team vs.` should be used, as this is the default scoring system that osu! uses. \n\rThe other score systems will make various changes real-time to scores when a beatmap has been finished, giving you unwanted results if you are expecting the normal `Team vs.` scoring.'
		}));

		createLobbyTutorial.addStep(new TutorialStep({
			route: 'lobby-overview/create-lobby',
			targetElementIds: [
				'tutorial-team-size'
			],
			content: 'Team size should also be fairly straight forward, this is the amount of players are allowed to be on a team. \n\rIf it is a 1v1 tournament, this can be set to 1, if it is a 2v2 tournament, this can be set to 2 and so on.'
		}));

		createLobbyTutorial.addStep(new TutorialStep({
			route: 'lobby-overview/create-lobby',
			targetElementIds: [
				'tutorial-select-tournament'
			],
			content: 'This field lets you select a tournament for which you will be refereeing a match. For this example we will select the `Tutorial tournament`. \n\rOnce you have selected the tournament, you can continue to the next step.'
		}));

		createLobbyTutorial.addStep(new TutorialStep({
			route: 'lobby-overview/create-lobby',
			targetElementIds: [
				'tutorial-select-stage'
			],
			content: 'For this dropdown you will select the stage for which you are refereeing the match for. When a stage is selected, the mappool for that stage will be used when you go to the IRC part of the client.'
		}));

		createLobbyTutorial.addStep(new TutorialStep({
			route: 'lobby-overview/create-lobby',
			targetElementIds: [
				'tutorial-qualifier'
			],
			content: 'Here you will select whether the lobby is supposed to be a qualifier lobby. If it is not a qualifier lobby, you can safely ignore this option.'
		}));

		createLobbyTutorial.addStep(new TutorialStep({
			route: 'lobby-overview/create-lobby',
			targetElementIds: [
				'tutorial-webhooks'
			],
			content: 'Webhooks are sent when certain things happen in a multiplayer lobby, a couple of examples are: \n\r' +
				'- When a multiplayer lobby gets created\n' +
				'- When a beatmap gets picked, banned or protected\n' +
				'- When a beatmap has finished\n\r' +
				'To disable these webhooks from being sent, you can toggle this option off. \n\r' +
				'---\n\r' +
				'**NOTE**: When you are refereeing a qualifier lobby, you can safely have this turned on. \n\rFor a qualifier lobby the only webhook that will be sent when this option is turned on is when a multiplayer lobby gets created. \n\rAs long as the channel on Discord is visible to tournament staff, it will not leak any information to any other participant.'
		}));

		createLobbyTutorial.addStep(new TutorialStep({
			route: 'lobby-overview/create-lobby',
			targetElementIds: [
				'tutorial-participants'
			],
			content: '## Normal lobby \n\r' +
				'When creating a normal lobby, you will be able to enter `Team one/two name`. As you can probably figure out, these are the names for the 2 teams (or players, if it is a 1v1 tournament). Below the text boxes you also see which team colour and team slot they are. \n\r' +
				'## Qualifier lobby \n\r' +
				'When creating a qualifier lobby, you will be able to enter a `Qualifier lobby identifier`, which essentially is the name for that given lobby.'
		}));

		createLobbyTutorial.addStep(new TutorialStep({
			route: 'lobby-overview/create-lobby',
			targetElementIds: [
				'tutorial-create-lobby'
			],
			content: 'Now that you have entered all the details needed for the match you are gonna be a referee for, you can go ahead and click on the `Create` button to create the multiplayer lobby. \n\r' +
				'This will create a new multiplayer lobby so that you can go ahead and start refereeing the match!'
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
