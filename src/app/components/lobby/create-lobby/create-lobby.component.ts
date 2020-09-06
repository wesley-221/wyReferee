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
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { BanchoMultiplayerChannel } from 'bancho.js';

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
	lobbyHasBeenCreated = false;

	ircAuthenticated = false;

	calculateScoreInterfaces: Calculate;

	teamOneArray: number[] = [];
	teamTwoArray: number[] = [];

	constructor(private multiplayerLobbies: MultiplayerLobbiesService, private toastService: ToastService, private ircService: IrcService, public tournamentService: TournamentService, private router: Router) {
		this.calculateScoreInterfaces = new Calculate();

		ircService.getIsAuthenticated().subscribe(isAuthenticated => {
			this.ircAuthenticated = isAuthenticated;
		});

		this.validationForm = new FormGroup({
			'multiplayer-link': new FormControl('', [
				Validators.pattern(/https:\/\/osu.ppy.sh\/community\/matches\/[0-9]+/)
			]),
			'tournament-acronym': new FormControl('', [
				Validators.maxLength(10)
			]),
			'score-interface': new FormControl('', [
				Validators.required
			]),
			'team-size': new FormControl('', [
				Validators.required,
				Validators.min(1),
				Validators.max(8),
				Validators.pattern(/^\d+$/)
			]),
			'team-one-name': new FormControl('', [
				Validators.required
			]),
			'team-two-name': new FormControl('', [
				Validators.required
			]),
			'webhook': new FormControl(),
			'selected-tournament': new FormControl()
		});
	}

	ngOnInit() { }

	changeTournament() {
		this.selectedTournament = this.tournamentService.getTournamentByName(this.validationForm.get('selected-tournament').value);
		this.changeTeamSize(this.selectedTournament != null ? this.selectedTournament.teamSize : null);

		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(this.selectedTournament ? this.selectedTournament.tournamentScoreInterfaceIdentifier : null);
		this.teamSize = this.selectedScoreInterface ? this.selectedScoreInterface.getTeamSize() : null;
		this.validationForm.get('team-size').setValue(this.selectedTournament != null ? this.selectedTournament.teamSize : this.teamSize);
		this.validationForm.get('tournament-acronym').setValue(this.selectedTournament != null ? this.selectedTournament.acronym : null);
		this.validationForm.get('score-interface').setValue(this.selectedScoreInterface ? this.selectedScoreInterface.getIdentifier() : null);
	}

	changeScoreInterface(event: MatSelectChange) {
		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(event.value);

		this.teamSize = this.selectedScoreInterface.getTeamSize();
		this.validationForm.get('team-size').setValue(this.teamSize);
	}

	createLobby() {
		if (this.validationForm.valid) {
			const newLobby = new MultiplayerLobby();

			newLobby.lobbyId = this.multiplayerLobbies.availableLobbyId;
			newLobby.teamOneName = this.validationForm.get('team-one-name').value;
			newLobby.teamTwoName = this.validationForm.get('team-two-name').value;
			newLobby.teamSize = this.validationForm.get('team-size').value;
			newLobby.multiplayerLink = this.validationForm.get('multiplayer-link').value;
			newLobby.tournamentAcronym = this.validationForm.get('tournament-acronym').value;
			newLobby.description = `${this.validationForm.get('team-one-name').value} vs ${this.validationForm.get('team-two-name').value}`;
			newLobby.webhook = this.validationForm.get('webhook').value;
			newLobby.scoreInterfaceIndentifier = this.selectedTournament ? this.selectedTournament.tournamentScoreInterfaceIdentifier : this.selectedScoreInterface.getIdentifier();

			if (newLobby.multiplayerLink == '') {
				this.ircService.isCreatingMultiplayerLobby = newLobby.lobbyId;

				from(this.ircService.client.createLobby(`${newLobby.tournamentAcronym}: (${newLobby.teamOneName}) vs (${newLobby.teamTwoName})`)).subscribe((multiplayerChannel: BanchoMultiplayerChannel) => {
					this.lobbyHasBeenCreated = true;

					this.ircService.joinChannel(multiplayerChannel.name);
					this.ircService.initializeChannelListeners(multiplayerChannel);

					setTimeout(() => {
						this.lobbyHasBeenCreated = false;
					}, 3000);

					newLobby.multiplayerLink = `https://osu.ppy.sh/community/matches/${multiplayerChannel.lobby.id}`;

					this.multiplayerLobbies.add(newLobby);

					this.toastService.addToast(`Successfully created the multiplayer lobby ${newLobby.description}!`);

					this.router.navigate(['lobby-overview/lobby-view', newLobby.lobbyId]);
				});
			}
		}
		else {
			this.validationForm.markAllAsTouched();
		}
	}

	getValidation(key: string): any {
		return this.validationForm.get(key);
	}

	changeTeamSize(teamSize: number) {
		this.teamOneArray = [];
		this.teamTwoArray = [];

		let teamSizeVal: any;

		if (teamSize == null || teamSize == undefined) {
			teamSizeVal = parseInt(this.getValidation('team-size').value >= 8 ? 8 : this.getValidation('team-size').value);
		}
		else {
			teamSizeVal = teamSize >= 8 ? 8 : teamSize;
		}

		teamSizeVal = parseInt(teamSizeVal);

		for (let i = 1; i < (teamSizeVal + 1); i++) {
			this.teamOneArray.push(i);
		}

		for (let i = teamSizeVal + 1; i < ((teamSizeVal * 2) + 1); i++) {
			this.teamTwoArray.push(i);
		}
	}
}
