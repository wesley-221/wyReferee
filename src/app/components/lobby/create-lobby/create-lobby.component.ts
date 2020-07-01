import { Component, OnInit } from '@angular/core';
import { MultiplayerLobby } from '../../../models/store-multiplayer/multiplayer-lobby';
import { MultiplayerLobbiesService } from '../../../services/multiplayer-lobbies.service';
import { ToastService } from '../../../services/toast.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IrcService } from '../../../services/irc.service';
import { ScoreInterface } from '../../../models/score-calculation/calculation-types/score-interface';
import { Calculate } from '../../../models/score-calculation/calculate';
import { TournamentService } from '../../../services/tournament.service';
import { Tournament } from '../../../models/tournament/tournament';

@Component({
	selector: 'app-create-lobby',
	templateUrl: './create-lobby.component.html',
	styleUrls: ['./create-lobby.component.scss']
})

export class CreateLobbyComponent implements OnInit {
	teamOneName: string;
	teamTwoName: string;
	multiplayerLobby: string;
	tournamentAcronym: string;
	matchDescription: string;
	selectedTournament: Tournament;
	teamSize: number;
	selectedScoreInterface: ScoreInterface;

	validationForm: FormGroup;
	lobbyHasBeenCreated: boolean = false;

	ircAuthenticated: boolean = false;

	calculateScoreInterfaces: Calculate;

	teamOneArray: number[] = [];
	teamTwoArray: number[] = [];

	constructor(private multiplayerLobbies: MultiplayerLobbiesService, private toastService: ToastService, private ircService: IrcService, public tournamentService: TournamentService) {
		this.calculateScoreInterfaces = new Calculate();

		ircService.getIsAuthenticated().subscribe(isAuthenticated => {
			this.ircAuthenticated = isAuthenticated;
		});
	}

	ngOnInit() {
		this.validationForm = new FormGroup({
			'multiplayerLink': new FormControl('', [
				Validators.pattern(/https\:\/\/osu.ppy.sh\/community\/matches\/[0-9]+/)
			]),
			'tournamentAcronym': new FormControl('', [
				Validators.maxLength(10)
			]),
			'scoreInterface': new FormControl('', [
				Validators.required
			]),
			'teamSize': new FormControl('', [
				Validators.min(1),
				Validators.max(8),
				Validators.pattern(/^\d+$/)
			]),
			'teamOneName': new FormControl('', [
				Validators.required
			]),
			'teamTwoName': new FormControl('', [
				Validators.required
			]),
			'webhook': new FormControl(),
			'selectedTournament': new FormControl()
		});
	}

	changeTournament() {
		this.selectedTournament = this.tournamentService.getTournamentByName(this.validationForm.get('selectedTournament').value);
		this.changeTeamSize(this.selectedTournament != null ? this.selectedTournament.teamSize : null);

		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(this.selectedTournament ? this.selectedTournament.tournamentScoreInterfaceIdentifier : null);
		this.teamSize = this.selectedScoreInterface ? this.selectedScoreInterface.getTeamSize() : null;
		this.validationForm.get('teamSize').setValue(this.selectedTournament != null ? this.selectedTournament.teamSize : this.teamSize);
		this.validationForm.get('tournamentAcronym').setValue(this.selectedTournament != null ? this.selectedTournament.acronym : null);
		this.validationForm.get('scoreInterface').setValue(this.selectedScoreInterface ? this.selectedScoreInterface.getIdentifier() : null);
	}

	changeScoreInterface(event: Event) {
		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface((<any>event.target).value);

		this.teamSize = this.selectedScoreInterface.getTeamSize();
		this.validationForm.get('teamSize').setValue(this.teamSize);
	}

	createLobby() {
		const newLobby = new MultiplayerLobby();

		newLobby.lobbyId = this.multiplayerLobbies.availableLobbyId;
		newLobby.teamOneName = this.validationForm.get('teamOneName').value;
		newLobby.teamTwoName = this.validationForm.get('teamTwoName').value;
		newLobby.teamSize = this.validationForm.get('teamSize').value;
		newLobby.multiplayerLink = this.validationForm.get('multiplayerLink').value;
		newLobby.tournamentAcronym = this.validationForm.get('tournamentAcronym').value;
		newLobby.description = `${this.validationForm.get('teamOneName').value} vs ${this.validationForm.get('teamTwoName').value}`;
		newLobby.webhook = this.validationForm.get('webhook').value;
		newLobby.scoreInterfaceIndentifier = this.selectedTournament ? this.selectedTournament.tournamentScoreInterfaceIdentifier : this.selectedScoreInterface.getIdentifier();

		if(newLobby.multiplayerLink == '') {
			this.ircService.isCreatingMultiplayerLobby = newLobby.lobbyId;

			this.ircService.client.say('BanchoBot', `!mp make ${newLobby.tournamentAcronym}: (${newLobby.teamOneName}) vs (${newLobby.teamTwoName})`);
		}

		this.lobbyHasBeenCreated = true;

		setTimeout(() => {
			this.lobbyHasBeenCreated = false;
		}, 3000);

		this.multiplayerLobbies.add(newLobby);

		this.toastService.addToast(`Successfully created the multiplayer lobby ${newLobby.description}!`);
	}

	getValidation(key: string): any {
		return this.validationForm.get(key);
	}

	changeTeamSize(teamSize: number) {
		this.teamOneArray = [];
		this.teamTwoArray = [];

		let teamSizeVal;

		if(teamSize == null || teamSize == undefined) {
			teamSizeVal = this.getValidation('teamSize').value >= 8 ? 8 : this.getValidation('teamSize').value;
		}
		else {
			teamSizeVal = teamSize >= 8 ? 8 : teamSize;
		}

		teamSizeVal = parseInt(teamSizeVal);

		for(let i = 1; i < (teamSizeVal + 1); i ++) {
			this.teamOneArray.push(i);
		}

		for(let i = teamSizeVal + 1; i < ((teamSizeVal * 2) + 1); i ++) {
			this.teamTwoArray.push(i);
		}
	}
}
