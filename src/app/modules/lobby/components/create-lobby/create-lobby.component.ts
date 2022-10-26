import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Lobby } from 'app/models/lobby';
import { OsuHelper } from 'app/models/osu-models/osu';
import { Calculate } from 'app/models/score-calculation/calculate';
import { ScoreInterface } from 'app/models/score-calculation/calculation-types/score-interface';
import { WyTeam } from 'app/models/wytournament/wy-team';
import { WyTournament } from 'app/models/wytournament/wy-tournament';
import { IrcService } from 'app/services/irc.service';
import { MultiplayerLobbyPlayersService } from 'app/services/multiplayer-lobby-players.service';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { WebhookService } from 'app/services/webhook.service';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';
import { BanchoMultiplayerChannel } from 'bancho.js';
import { Observable, startWith, map, from } from 'rxjs';

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
	selectedTournament: WyTournament;
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

	teamOneFilter: Observable<WyTeam[]>;
	teamTwoFilter: Observable<WyTeam[]>;

	qualifier: boolean;
	qualifierLobbyIdentifier: string;
	lobbyWithBrackets: boolean;
	webhook: boolean;

	constructor(
		private multiplayerLobbies: WyMultiplayerLobbiesService,
		private toastService: ToastService,
		private ircService: IrcService,
		public tournamentService: TournamentService,
		private router: Router,
		private webhookService: WebhookService,
		private multiplayerLobbiesPlayersService: MultiplayerLobbyPlayersService) {
		this.calculateScoreInterfaces = new Calculate();

		this.qualifier = false;
		this.lobbyWithBrackets = false;
		this.webhook = true;

		ircService.getIsAuthenticated().subscribe(isAuthenticated => {
			this.ircAuthenticated = isAuthenticated;
		});

		this.validationForm = new FormGroup({
			'multiplayer-link': new FormControl('', [
				Validators.pattern(/https:\/\/osu\.ppy\.sh\/(?:community\/matches|mp)\/([0-9]+)/)
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
			'selected-tournament': new FormControl('')
		});

		this.teamOneFilter = this.validationForm.get('team-one-name').valueChanges.pipe(
			startWith(''),
			map((value: string) => {
				const filterValue = value.toLowerCase();
				return this.selectedTournament.teams.filter(option => option.name.toLowerCase().includes(filterValue));
			})
		);

		this.teamTwoFilter = this.validationForm.get('team-two-name').valueChanges.pipe(
			startWith(''),
			map((value: string) => {
				const filterValue = value.toLowerCase();
				return this.selectedTournament.teams.filter(option => option.name.toLowerCase().includes(filterValue));
			})
		);
	}

	ngOnInit() { }

	changeTournament() {
		this.selectedTournament = this.tournamentService.getTournamentById(this.validationForm.get('selected-tournament').value);
		this.changeTeamSize(this.selectedTournament != null ? this.selectedTournament.teamSize : null);

		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(this.selectedTournament ? this.selectedTournament.scoreInterfaceIdentifier : null);
		this.teamSize = this.selectedScoreInterface ? this.selectedScoreInterface.getTeamSize() : null;
		this.validationForm.get('team-size').setValue(this.selectedTournament != null ? this.selectedTournament.teamSize : this.teamSize);
		this.validationForm.get('tournament-acronym').setValue(this.selectedTournament != null ? this.selectedTournament.acronym : null);
		this.validationForm.get('score-interface').setValue(this.selectedScoreInterface ? this.selectedScoreInterface.getIdentifier() : null);

		// Make sure to reset challonge matches
		this.challongeMatches = [];

		this.validationForm.addControl('team-one-name', new FormControl('', Validators.required));
		this.validationForm.addControl('team-two-name', new FormControl('', Validators.required));

		this.validationForm.addControl('stage', new FormControl('', Validators.required));

		this.validationForm.removeControl('challonge-match');
		this.validationForm.removeControl('challonge-tournament');

		this.lobbyWithBrackets = this.selectedTournament.lobbyTeamNameWithBrackets;

		// TODO: re-implement challonge integration
		// this.checkingChallongeIntegration = true;

		// this.challongeService.getChallongeMatchups(this.selectedTournament).subscribe((result: any) => {
		// 	if (result == null) {
		// 		this.checkingChallongeIntegration = false;
		// 		return;
		// 	}

		// 	// TODO: add check for Group stage matches, ignore those
		// 	// this.challongeMatches = this.challongeService.parseChallongeEndpoint(result);

		// 	if (this.challongeMatches.length > 0) {
		// 		this.challongeMatches.sort((firstMatch, secondMatch) => firstMatch.suggested_play_order - secondMatch.suggested_play_order);

		// 		this.validationForm.removeControl('team-one-name');
		// 		this.validationForm.removeControl('team-two-name');

		// 		this.validationForm.addControl('challonge-match', new FormControl('', Validators.required));
		// 		this.validationForm.addControl('challonge-tournament', new FormControl());
		// 	}

		// 	this.checkingChallongeIntegration = false;
		// }, () => {
		// 	this.checkingChallongeIntegration = false;
		// });
	}

	changeScoreInterface(event: MatSelectChange) {
		this.selectedScoreInterface = this.calculateScoreInterfaces.getScoreInterface(event.value);

		this.teamSize = this.selectedScoreInterface.getTeamSize();
		this.validationForm.get('team-size').setValue(this.teamSize);
	}

	changeChallongeMatch(event: MatSelectChange) {
		const findMatch = this.challongeMatches.find(match => match.id == event.value);

		this.validationForm.get('challonge-match').setValue(findMatch.id);
		this.validationForm.get('challonge-tournament').setValue(findMatch.tournament_id);
	}

	createLobby() {
		if (this.validationForm.valid) {
			let lobby: Lobby;

			if (this.qualifier == true) {
				lobby = new Lobby({
					lobbyId: this.multiplayerLobbies.availableLobbyId,
					teamSize: this.validationForm.get('team-size').value,
					multiplayerLink: this.validationForm.get('multiplayer-link').value,
					tournamentId: this.selectedTournament != null ? this.selectedTournament.id : null,
					tournament: this.selectedTournament,
					teamOneName: 'Qualifier lobby',
					teamTwoName: 'Qualifier lobby',
					isQualifierLobby: true
				});

				lobby.description = `Qualifier lobby: ${this.qualifierLobbyIdentifier}`;
			}
			else {
				lobby = new Lobby({
					lobbyId: this.multiplayerLobbies.availableLobbyId,
					teamSize: this.validationForm.get('team-size').value,
					multiplayerLink: this.validationForm.get('multiplayer-link').value,
					tournamentId: this.selectedTournament != null ? this.selectedTournament.id : null,
					tournament: this.selectedTournament,
					teamOneName: this.validationForm.get('team-one-name').value,
					teamTwoName: this.validationForm.get('team-two-name').value,
					isQualifierLobby: false
				});

				lobby.description = `${lobby.teamOneName} vs ${lobby.teamTwoName}`;
			}

			if (this.selectedTournament != undefined || this.selectedTournament != null) {
				const selectedStage = this.validationForm.get('stage').value;

				for (const stage of this.selectedTournament.stages) {
					if (stage.name == selectedStage) {
						lobby.selectedStage = stage;
						lobby.bestOf = stage.bestOf;

						break;
					}
				}

				lobby.sendWebhooks = this.webhook;

				for (const mappool of this.selectedTournament.mappools) {
					if (mappool.name == selectedStage) {
						lobby.mappoolId = mappool.id;
						lobby.mappool = mappool;

						break;
					}
				}
			}

			this.multiplayerLobbiesPlayersService.createNewMultiplayerLobbyObject(lobby.lobbyId);

			this.ircService.isCreatingMultiplayerLobby = lobby.lobbyId;

			// Multiplayer link was not found, create new lobby
			if (lobby.multiplayerLink == '') {
				let lobbyName: string;

				if (lobby.tournament == undefined || lobby.tournament == null) {
					const acronym: string = this.validationForm.get('tournament-acronym').value;

					lobbyName = this.qualifier == true ? `${acronym}: Qualifier lobby: ${this.qualifierLobbyIdentifier}` : this.lobbyWithBrackets == true ? `${acronym}: (${lobby.teamOneName}) vs (${lobby.teamTwoName})` : `${acronym}: ${lobby.teamOneName} vs ${lobby.teamTwoName}`;
				}
				else {
					lobbyName = this.qualifier == true ? `${lobby.tournament.acronym}: Qualifier lobby: ${this.qualifierLobbyIdentifier}` : this.lobbyWithBrackets == true ? `${lobby.tournament.acronym}: (${lobby.teamOneName}) vs (${lobby.teamTwoName})` : `${lobby.tournament.acronym}: ${lobby.teamOneName} vs ${lobby.teamTwoName}`;
				}

				from(this.ircService.client.createLobby(lobbyName)).subscribe((multiplayerChannel: BanchoMultiplayerChannel) => {
					if (lobby.isQualifierLobby) {
						this.ircService.joinChannel(multiplayerChannel.name, lobby.description);
					}
					else {
						this.ircService.joinChannel(multiplayerChannel.name, `${lobby.teamOneName} vs. ${lobby.teamTwoName}`);
					}


					this.lobbyHasBeenCreatedTrigger();

					lobby.multiplayerLink = `https://osu.ppy.sh/community/matches/${multiplayerChannel.lobby.id}`;
					this.multiplayerLobbies.addMultiplayerLobby(lobby);

					this.ircService.initializeChannelListeners(multiplayerChannel);

					this.toastService.addToast(`Successfully created the multiplayer lobby ${lobby.description}!`);
					this.webhookService.sendMatchCreation(lobby, this.ircService.authenticatedUser);

					this.router.navigate(['lobby-overview/lobby-view', lobby.lobbyId]);
				});
			}
			// Multiplayer link was found, attempt to join lobby
			else {
				const multiplayerId = OsuHelper.getMultiplayerIdFromLink(lobby.multiplayerLink);
				const multiplayerChannel = this.ircService.client.getChannel(`#mp_${multiplayerId}`) as BanchoMultiplayerChannel;

				from(multiplayerChannel.join()).subscribe(() => {
					this.ircService.joinChannel(multiplayerChannel.name);
					this.ircService.initializeChannelListeners(multiplayerChannel);

					this.lobbyHasBeenCreatedTrigger();

					this.multiplayerLobbies.addMultiplayerLobby(lobby);

					this.toastService.addToast(`Successfully joined the multiplayer lobby ${multiplayerChannel.name}!`);

					this.router.navigate(['lobby-overview/lobby-view', lobby.lobbyId]);
				}, () => {
					this.lobbyHasBeenCreatedTrigger();
					this.multiplayerLobbies.addMultiplayerLobby(lobby);

					this.toastService.addToast(`Successfully joined the multiplayer lobby ${multiplayerChannel.name}! Unable to connect to the irc channel, lobby is most likely closed already.`);

					this.router.navigate(['lobby-overview/lobby-view', lobby.lobbyId]);
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

	changeTeamSize(teamSize?: number) {
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

	changeQualifierLobby(): void {
		if (this.qualifier == true) {
			this.validationForm.addControl('qualifier-lobby-identifier', new FormControl('', Validators.required));
			this.validationForm.removeControl('team-one-name');
			this.validationForm.removeControl('team-two-name');

			this.validationForm.controls['qualifier-lobby-identifier'].valueChanges.subscribe(value => {
				this.qualifierLobbyIdentifier = value;
			});
		}
		else {
			this.validationForm.removeControl('qualifier-lobby-identifier');
			this.validationForm.addControl('team-one-name', new FormControl('', Validators.required));
			this.validationForm.addControl('team-two-name', new FormControl('', Validators.required));
		}
	}
}
