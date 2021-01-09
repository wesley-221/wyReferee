import { Component, OnInit } from '@angular/core';
import { AxSCalculation } from 'app/models/score-calculation/calculation-types/axs-calculation';
import { MultiplayerDataUser } from 'app/models/store-multiplayer/multiplayer-data-user';

@Component({
	selector: 'app-axs-calculator',
	templateUrl: './axs-calculator.component.html',
	styleUrls: ['./axs-calculator.component.scss']
})
export class AxsCalculatorComponent implements OnInit {
	playerOneAccuracy: number = 100;
	playerOneScore: number = 1000000;

	playerTwoAccuracy: number = 100;
	playerTwoScore: number = 1000000;

	playerThreeAccuracy: number = 100;
	playerThreeScore: number = 1000000;

	playerFourAccuracy: number = 100;
	playerFourScore: number = 1000000;

	playerFiveAccuracy: number = 100;
	playerFiveScore: number = 1000000;

	playerSixAccuracy: number = 100;
	playerSixScore: number = 1000000;

	modifier: number = 0;

	teamOneScore: number;
	teamTwoScore: number;

	constructor() { }
	ngOnInit(): void {
		this.onChange();
	}

	onChange() {
		const scoreInterface = new AxSCalculation('AxS', 3);
		scoreInterface.setModifier(this.modifier);

		const playerOne = new MultiplayerDataUser();
		playerOne.slot = 0;
		playerOne.accuracy = this.playerOneAccuracy;
		playerOne.score = this.playerOneScore;

		const playerTwo = new MultiplayerDataUser();
		playerTwo.slot = 1;
		playerTwo.accuracy = this.playerTwoAccuracy;
		playerTwo.score = this.playerTwoScore;

		const playerThree = new MultiplayerDataUser();
		playerThree.slot = 2;
		playerThree.accuracy = this.playerThreeAccuracy;
		playerThree.score = this.playerThreeScore;

		const playerFour = new MultiplayerDataUser();
		playerFour.slot = 3;
		playerFour.accuracy = this.playerFourAccuracy;
		playerFour.score = this.playerFourScore;

		const playerFive = new MultiplayerDataUser();
		playerFive.slot = 4;
		playerFive.accuracy = this.playerFiveAccuracy;
		playerFive.score = this.playerFiveScore;

		const playerSix = new MultiplayerDataUser();
		playerSix.slot = 5;
		playerSix.accuracy = this.playerSixAccuracy;
		playerSix.score = this.playerSixScore;

		scoreInterface.addUserScore(playerOne);
		scoreInterface.addUserScore(playerTwo);
		scoreInterface.addUserScore(playerThree);
		scoreInterface.addUserScore(playerFour);
		scoreInterface.addUserScore(playerFive);
		scoreInterface.addUserScore(playerSix);

		this.teamOneScore = scoreInterface.calculateTeamOneScore();
		this.teamTwoScore = scoreInterface.calculateTeamTwoScore();
	}
}
