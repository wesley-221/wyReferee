import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Lobby } from 'app/models/lobby';
import { OsuHelper } from 'app/models/osu-models/osu';
import { IrcService } from 'app/services/irc.service';
import { MultiplayerLobbyPlayersService } from 'app/services/multiplayer-lobby-players.service';
import { ToastService } from 'app/services/toast.service';
import { TournamentService } from 'app/services/tournament.service';
import { WebhookService } from 'app/services/webhook.service';
import { WyMultiplayerLobbiesService } from 'app/services/wy-multiplayer-lobbies.service';
import { WybinService } from 'app/services/wybin.service';
import { BanchoMultiplayerChannel } from 'bancho.js';
import { from } from 'rxjs';
import { LobbyFormComponent } from '../lobby-form/lobby-form.component';
import { LobbyCreationContextService } from 'app/services/lobby-creation-context.service';

@Component({
	selector: 'app-create-lobby',
	templateUrl: './create-lobby.component.html',
	styleUrls: ['./create-lobby.component.scss']
})

export class CreateLobbyComponent implements OnInit {
	@ViewChild(LobbyFormComponent) lobbyFormComponent: LobbyFormComponent;

	validationForm: FormGroup;

	lobbyHasBeenCreated = false;
	ircAuthenticated = false;
	creatingMultiplayerLobby = false;

	constructor(
		private multiplayerLobbies: WyMultiplayerLobbiesService,
		private toastService: ToastService,
		private ircService: IrcService,
		public tournamentService: TournamentService,
		private router: Router,
		private webhookService: WebhookService,
		private multiplayerLobbiesPlayersService: MultiplayerLobbyPlayersService,
		private wybinService: WybinService,
		private lobbyCreationContextService: LobbyCreationContextService) {

		this.ircService.getIsAuthenticated().subscribe(isAuthenticated => {
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
			'selected-tournament': new FormControl(''),
			'custom-match': new FormControl(false)
		});

		this.tournamentService.loadTournaments(false);
	}

	ngOnInit() {
		const { tournament, match } = this.lobbyCreationContextService.getContext();

		if (tournament && match) {
			for (const findTournament of this.tournamentService.allTournaments) {
				if (findTournament.wyBinTournamentId == tournament.id) {
					// Delay setting the value to make sure the form has been loaded properly
					// Otherwise it will not trigger the valueChanges observable
					setTimeout(() => {
						this.validationForm.get('selected-tournament').setValue(findTournament.id);

						this.lobbyCreationContextService.getStagesLoadedObservable().subscribe(stagesLoaded => {
							if (stagesLoaded == true) {
								// Delay setting the value to make sure the form has been loaded properly
								// Otherwise the matches will not be populated
								setTimeout(() => {
									this.validationForm.get('stage-id').setValue(match.wyBinStageId);

									this.validationForm.get('selected-match-id').setValue(match.id);
									this.validationForm.get('selected-match-name').setValue(match.getMatchName());

									if (match.qualifierIdentifier == null) {
										this.validationForm.get('team-one-name').setValue(match.opponentOne.name);
										this.validationForm.get('team-two-name').setValue(match.opponentTwo.name);
									}
									else {
										this.validationForm.get('qualifier-lobby-identifier').setValue(match.qualifierIdentifier);
									}

									this.lobbyCreationContextService.clear();
								}, 1);
							}
						});
					}, 1);
				}
			}
		}
	}

	/**
	 * Create a new multiplayer lobby
	 *
	 * Note: Currently exactly the same function as JoinLobbyComponent#joinLobby().
	 * If you make any changes, make sure to change them there as well
	 */
	createLobby() {
		if (this.creatingMultiplayerLobby == true) {
			return;
		}

		const lobbyForm = this.lobbyFormComponent.getVariables();

		if (this.validationForm.valid) {
			let lobby: Lobby;

			if (lobbyForm.qualifier == true) {
				lobby = new Lobby({
					lobbyId: this.multiplayerLobbies.availableLobbyId,
					teamSize: this.validationForm.get('team-size').value,
					multiplayerLink: this.validationForm.get('multiplayer-link').value,
					tournamentId: lobbyForm.selectedTournament != null ? lobbyForm.selectedTournament.id : null,
					tournament: lobbyForm.selectedTournament,
					teamOneName: 'Qualifier lobby',
					teamTwoName: 'Qualifier lobby',
					isQualifierLobby: true
				});

				lobby.description = `Qualifier lobby: ${lobbyForm.qualifierLobbyIdentifier}`;
			}
			else {
				lobby = new Lobby({
					lobbyId: this.multiplayerLobbies.availableLobbyId,
					teamSize: this.validationForm.get('team-size').value,
					multiplayerLink: this.validationForm.get('multiplayer-link').value,
					tournamentId: lobbyForm.selectedTournament != null ? lobbyForm.selectedTournament.id : null,
					tournament: lobbyForm.selectedTournament,
					teamOneName: this.validationForm.get('team-one-name').value,
					teamTwoName: this.validationForm.get('team-two-name').value,
					isQualifierLobby: false
				});

				lobby.description = `${lobby.teamOneName} vs. ${lobby.teamTwoName}`;
			}

			if (lobbyForm.selectedTournament != undefined || lobbyForm.selectedTournament != null) {
				const selectedStage = this.validationForm.get('stage').value;

				for (const stage of lobbyForm.selectedTournament.stages) {
					if (stage.wyBinStageId != undefined || stage.wyBinStageId != null) {
						const wyBinSelectedStageId = this.validationForm.get('stage-id').value;

						if (stage.wyBinStageId == wyBinSelectedStageId) {
							lobby.selectedStage = stage;
							lobby.bestOf = stage.bestOf;
							lobby.banCount = stage.bans;

							lobby.teamOneHealth = Number(stage.hitpoints);
							lobby.teamTwoHealth = Number(stage.hitpoints);

							break;
						}
					}
					else {
						if (stage.name.toLowerCase() == selectedStage.toLowerCase()) {
							lobby.selectedStage = stage;
							lobby.bestOf = stage.bestOf;
							lobby.banCount = stage.bans;

							lobby.teamOneHealth = Number(stage.hitpoints);
							lobby.teamTwoHealth = Number(stage.hitpoints);

							break;
						}
					}
				}

				lobby.sendWebhooks = lobbyForm.webhook;

				for (const mappool of lobbyForm.selectedTournament.mappools) {
					if (mappool.name == selectedStage) {
						lobby.mappoolId = mappool.id;
						lobby.mappool = mappool;

						break;
					}
				}
			}
			else {
				lobby.bestOf = 3;
			}

			if (lobbyForm.selectedTournament && lobbyForm.selectedTournament.hasWyBinConnected()) {
				if (this.validationForm.get('custom-match').value == false) {
					lobby.wybinStageId = this.validationForm.get('stage-id').value;
					lobby.wybinMatchId = this.validationForm.get('selected-match-id').value;
				}
			}

			this.multiplayerLobbiesPlayersService.createNewMultiplayerLobbyObject(lobby.lobbyId);

			this.ircService.isCreatingMultiplayerLobby = lobby.lobbyId;

			// Multiplayer link was not found, create new lobby
			if (lobby.multiplayerLink == '') {
				if (lobby.tournament == undefined || lobby.tournament == null) {
					const acronym: string = this.validationForm.get('tournament-acronym').value;

					if (lobbyForm.qualifier == true) {
						lobby.description = this.getLobbyDescription(acronym, "Qualifier", lobbyForm.qualifierLobbyIdentifier, lobbyForm.lobbyWithBrackets);
					}
					else {
						lobby.description = this.getLobbyDescription(acronym, lobby.getEscapedTeamOneName(), lobby.getEscapedTeamTwoName(), lobbyForm.lobbyWithBrackets);
					}
				}
				else {
					if (lobbyForm.qualifier == true) {
						lobby.description = this.getLobbyDescription(lobby.tournament.acronym, "Qualifier", lobbyForm.qualifierLobbyIdentifier, lobbyForm.lobbyWithBrackets);
					}
					else {
						lobby.description = this.getLobbyDescription(lobby.tournament.acronym, lobby.getEscapedTeamOneName(), lobby.getEscapedTeamTwoName(), lobbyForm.lobbyWithBrackets);
					}
				}

				this.creatingMultiplayerLobby = true;

				from(this.ircService.client.createLobby(lobby.description)).subscribe((multiplayerChannel: BanchoMultiplayerChannel) => {
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

					// Set the default settings for irc lobby
					if (lobbyForm.selectedTournament) {
						this.ircService.sendMessage(multiplayerChannel.name, `!mp set ${lobbyForm.selectedTournament.defaultTeamMode} ${lobbyForm.selectedTournament.defaultWinCondition} ${lobbyForm.selectedTournament.defaultPlayers}`);
					}

					if (lobbyForm.selectedTournament && lobbyForm.selectedTournament.hasWyBinConnected()) {
						this.wybinService.getMatch(lobbyForm.selectedTournament.wyBinTournamentId, lobby.wybinStageId, lobby.wybinMatchId, lobby.selectedStage.name, lobby.teamOneName, lobby.teamTwoName).subscribe((match: any) => {
							if (match == null) {
								this.webhookService.sendMatchCreation(lobby, this.ircService.authenticatedUser);
								return;
							}

							const commentatorNames: string[] = [];
							const streamerNames: string[] = [];
							const refereeNames: string[] = [];

							for (const commentator of match.assignedCommentators) {
								commentatorNames.push(commentator.user.username);
							}

							for (const streamer of match.assignedStreamers) {
								streamerNames.push(streamer.user.username);
							}

							for (const referee of match.assignedReferees) {
								refereeNames.push(referee.user.username);
							}

							this.webhookService.sendMatchCreation(lobby, this.ircService.authenticatedUser, streamerNames, commentatorNames);
						}, () => {
							this.webhookService.sendMatchCreation(lobby, this.ircService.authenticatedUser);
						});
					}

					this.creatingMultiplayerLobby = false;

					this.router.navigate(['lobby-overview/lobby-view', lobby.lobbyId]);
				});
			}
			// Multiplayer link was found, attempt to join lobby
			else {
				const multiplayerId = OsuHelper.getMultiplayerIdFromLink(lobby.multiplayerLink);
				const multiplayerChannel = this.ircService.client.getChannel(`#mp_${multiplayerId}`) as BanchoMultiplayerChannel;

				this.creatingMultiplayerLobby = true;

				multiplayerChannel.leave()
					.finally(() => {
						from(multiplayerChannel.join()).subscribe(() => {
							this.ircService.joinChannel(multiplayerChannel.name);
							this.ircService.initializeChannelListeners(multiplayerChannel, lobby);

							this.lobbyHasBeenCreatedTrigger();

							this.multiplayerLobbies.addMultiplayerLobby(lobby);

							this.toastService.addToast(`Successfully joined the multiplayer lobby ${multiplayerChannel.name}!`);

							this.creatingMultiplayerLobby = false;

							this.router.navigate(['lobby-overview/lobby-view', lobby.lobbyId]);
						}, () => {
							this.lobbyHasBeenCreatedTrigger();
							this.multiplayerLobbies.addMultiplayerLobby(lobby);

							this.toastService.addToast(`Successfully joined the multiplayer lobby ${multiplayerChannel.name}! Unable to connect to the irc channel, lobby is most likely closed already.`);

							this.creatingMultiplayerLobby = false;

							this.router.navigate(['lobby-overview/lobby-view', lobby.lobbyId]);
						});
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

	getLobbyDescription(acronym: string, teamOneName: string, teamTwoName: string, lobbyWithBrackets: boolean): string {
		if (lobbyWithBrackets == true) {
			return `${acronym}: (${teamOneName}) vs (${teamTwoName})`;
		}
		else {
			return `${acronym}: ${teamOneName} vs ${teamTwoName}`;
		}
	}
}
