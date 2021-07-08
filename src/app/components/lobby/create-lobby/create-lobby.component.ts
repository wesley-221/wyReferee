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
import { ChallongeService } from 'app/services/challonge.service';
import { OsuHelper } from 'app/models/osu-models/osu';

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

	challongeMatches: ChallongeMatch[] = [];
	checkingChallongeIntegration = false;

	constructor(
		private multiplayerLobbies: MultiplayerLobbiesService,
		private toastService: ToastService,
		private ircService: IrcService,
		public tournamentService: TournamentService,
		private router: Router,
		private challongeService: ChallongeService) {
		this.calculateScoreInterfaces = new Calculate();

		ircService.getIsAuthenticated().subscribe(isAuthenticated => {
			this.ircAuthenticated = isAuthenticated;
		});

		this.validationForm = new FormGroup({
			'multiplayer-link': new FormControl('', [
				Validators.pattern(/https:\/\/osu.ppy.sh\/community\/matches\/[0-9]+/)
			]),
			'tournament-acronym': new FormControl('', [
				Validators.required,
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
		// TODO: fix this
		// this.selectedTournament = this.tournamentService.getTournamentByName(this.validationForm.get('selected-tournament').value);
		this.changeTeamSize(this.selectedTournament != null ? this.selectedTournament.teamSize : null);

		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(this.selectedTournament ? this.selectedTournament.tournamentScoreInterfaceIdentifier : null);
		this.teamSize = this.selectedScoreInterface ? this.selectedScoreInterface.getTeamSize() : null;
		this.validationForm.get('team-size').setValue(this.selectedTournament != null ? this.selectedTournament.teamSize : this.teamSize);
		this.validationForm.get('tournament-acronym').setValue(this.selectedTournament != null ? this.selectedTournament.acronym : null);
		this.validationForm.get('score-interface').setValue(this.selectedScoreInterface ? this.selectedScoreInterface.getIdentifier() : null);

		// Make sure to reset challonge matches
		this.challongeMatches = [];

		this.validationForm.addControl('team-one-name', new FormControl('', Validators.required));
		this.validationForm.addControl('team-two-name', new FormControl('', Validators.required));

		this.validationForm.removeControl('challonge-match');
		this.validationForm.removeControl('challonge-tournament');

		this.checkingChallongeIntegration = true;

		this.challongeService.getChallongeMatchups(this.selectedTournament).subscribe((result: any) => {
			if (result == null) {
				this.checkingChallongeIntegration = false;
				return;
			}

			// TODO: add check for Group stage matches, ignore those
			// this.challongeMatches = this.challongeService.parseChallongeEndpoint(result);

			if (this.challongeMatches.length > 0) {
				this.challongeMatches.sort((firstMatch, secondMatch) => firstMatch.suggested_play_order - secondMatch.suggested_play_order);

				this.validationForm.removeControl('team-one-name');
				this.validationForm.removeControl('team-two-name');

				this.validationForm.addControl('challonge-match', new FormControl('', Validators.required));
				this.validationForm.addControl('challonge-tournament', new FormControl());
			}

			this.checkingChallongeIntegration = false;
		}, () => {
			this.checkingChallongeIntegration = false;
		});
	}

	changeScoreInterface(event: MatSelectChange) {
		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(event.value);

		this.teamSize = this.selectedScoreInterface.getTeamSize();
		this.validationForm.get('team-size').setValue(this.teamSize);
	}

	changeChallongeMatch(event: MatSelectChange) {
		const match = this.challongeMatches.find(match => match.id == event.value);

		this.validationForm.get('challonge-match').setValue(match.id);
		this.validationForm.get('challonge-tournament').setValue(match.tournament_id);
	}

	createLobby() {
		if (this.validationForm.valid) {
			const newLobby = new MultiplayerLobby();

			newLobby.lobbyId = this.multiplayerLobbies.availableLobbyId;
			newLobby.teamSize = this.validationForm.get('team-size').value;
			newLobby.multiplayerLink = this.validationForm.get('multiplayer-link').value;
			newLobby.tournamentId = this.selectedTournament != undefined && this.selectedTournament.publishId != undefined ? this.selectedTournament.publishId : null;
			newLobby.tournamentAcronym = this.validationForm.get('tournament-acronym').value;
			newLobby.webhook = this.validationForm.get('webhook').value;
			newLobby.scoreInterfaceIndentifier = this.selectedTournament ? this.selectedTournament.tournamentScoreInterfaceIdentifier : this.selectedScoreInterface.getIdentifier();

			if (this.challongeMatches.length > 0) {
				newLobby.challongeMatchId = this.validationForm.get('challonge-match').value;
				newLobby.challongeTournamentId = this.validationForm.get('challonge-tournament').value;

				const match = this.challongeMatches.find(match => match.id == newLobby.challongeMatchId);

				newLobby.teamOneName = match.getPlayer1Name();
				newLobby.teamTwoName = match.getPlayer2Name();

				newLobby.challongePlayerOneId = match.player1_id;
				newLobby.challongePlayerTwoId = match.player2_id;
			}
			else {
				newLobby.teamOneName = this.validationForm.get('team-one-name').value;
				newLobby.teamTwoName = this.validationForm.get('team-two-name').value;
			}

			newLobby.description = `${newLobby.teamOneName} vs ${newLobby.teamTwoName}`;

			this.ircService.isCreatingMultiplayerLobby = newLobby.lobbyId;

			// Create a new lobby
			if (newLobby.multiplayerLink == '') {
				from(this.ircService.client.createLobby(`${newLobby.tournamentAcronym}: (${newLobby.teamOneName}) vs (${newLobby.teamTwoName})`)).subscribe((multiplayerChannel: BanchoMultiplayerChannel) => {
					this.ircService.joinChannel(multiplayerChannel.name);
					this.ircService.initializeChannelListeners(multiplayerChannel);

					this.lobbyHasBeenCreatedTrigger();

					newLobby.multiplayerLink = `https://osu.ppy.sh/community/matches/${multiplayerChannel.lobby.id}`;

					this.multiplayerLobbies.add(newLobby);

					this.toastService.addToast(`Successfully created the multiplayer lobby ${newLobby.description}!`);

					this.router.navigate(['lobby-overview/lobby-view', newLobby.lobbyId]);
				});
			}
			// Join an existing channel
			else {
				const multiplayerId = OsuHelper.getMultiplayerIdFromLink(newLobby.multiplayerLink);
				const multiplayerChannel = this.ircService.client.getChannel(`#mp_${multiplayerId}`) as BanchoMultiplayerChannel;

				from(multiplayerChannel.join()).subscribe(() => {
					this.ircService.joinChannel(multiplayerChannel.name);
					this.ircService.initializeChannelListeners(multiplayerChannel);

					this.lobbyHasBeenCreatedTrigger();

					this.multiplayerLobbies.add(newLobby);

					this.toastService.addToast(`Successfully joined the multiplayer lobby ${multiplayerChannel.name}!`);

					this.router.navigate(['lobby-overview/lobby-view', newLobby.lobbyId]);
				}, () => {
					this.lobbyHasBeenCreatedTrigger();
					this.multiplayerLobbies.add(newLobby);

					this.toastService.addToast(`Successfully joined the multiplayer lobby ${multiplayerChannel.name}! Unable to connect to the irc channel, lobby is most likely closed already.`);

					this.router.navigate(['lobby-overview/lobby-view', newLobby.lobbyId]);
				});
			}
		}
		else {
			this.validationForm.markAllAsTouched();
		}
	}

	lobbyHasBeenCreatedTrigger() {
		this.lobbyHasBeenCreated = true;

		setTimeout(() => {
			this.lobbyHasBeenCreated = false;
		}, 3000);
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
