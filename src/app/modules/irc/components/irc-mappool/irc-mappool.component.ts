import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { IrcChannel } from '../../../../models/irc/irc-channel';
import { ElectronService } from '../../../../services/electron.service';
import { WyModBracket } from '../../../../models/wytournament/mappool/wy-mod-bracket';
import { WyModBracketMap } from '../../../../models/wytournament/mappool/wy-mod-bracket-map';

@Component({
	selector: 'app-irc-mappool',
	templateUrl: './irc-mappool.component.html',
	styleUrl: './irc-mappool.component.scss'
})
export class IrcMappoolComponent {
	@Output() banBeatmapEmitter = new EventEmitter<{ beatmap: WyModBracketMap, modBracket: WyModBracket, multiplayerLobby: Lobby }>();
	@Output() unbanBeatmapEmitter = new EventEmitter<WyModBracketMap>();
	@Output() protectBeatmapEmitter = new EventEmitter<{ beatmap: WyModBracketMap, modBracket: WyModBracket, multiplayerLobby: Lobby }>();
	@Output() unprotectBeatmapEmitter = new EventEmitter<WyModBracketMap>();
	@Output() changePickedByEmitter = new EventEmitter<WyModBracketMap>();
	@Output() pickBeatmapEmitter = new EventEmitter<{ beatmap: WyModBracketMap, modBracket: WyModBracket, gamemode: number }>();
	@Output() unpickBeatmapEmitter = new EventEmitter<WyModBracketMap>();

	@Input() selectedLobby: Lobby;
	@Input() selectedChannel: IrcChannel;
	@Input() searchValue: string;

	constructor(
		public electronService: ElectronService
	) { }

	showBanButton(beatmap: WyModBracketMap) {
		return !this.selectedLobby.beatmapIsBanned(beatmap.beatmapId) &&
			!this.selectedLobby.beatmapIsPicked(beatmap.beatmapId) &&
			this.selectedLobby.isQualifierLobby == false;
	}

	showUnbanButton(beatmap: WyModBracketMap) {
		return this.selectedLobby.beatmapIsBanned(beatmap.beatmapId);
	}

	showProtectButton(beatmap: WyModBracketMap) {
		return this.selectedLobby.tournament.protects === true &&
			!this.selectedLobby.isQualifierLobby &&
			!this.selectedLobby.beatmapIsBanned(beatmap.beatmapId) &&
			!this.selectedLobby.beatmapIsPicked(beatmap.beatmapId) &&
			!this.selectedLobby.beatmapIsProtected(beatmap.beatmapId);
	}

	showUnprotectButton(beatmap: WyModBracketMap) {
		return this.selectedLobby.tournament.protects === true &&
			!this.selectedLobby.isQualifierLobby &&
			this.selectedLobby.beatmapIsProtected(beatmap.beatmapId);
	}

	showReassignPickButton(beatmap: WyModBracketMap) {
		return !this.selectedLobby.beatmapIsBanned(beatmap.beatmapId) &&
			this.selectedLobby.beatmapIsPicked(beatmap.beatmapId) &&
			this.selectedLobby.isQualifierLobby == false;
	}

	showPickButton(beatmap: WyModBracketMap) {
		return !this.selectedLobby.beatmapIsBanned(beatmap.beatmapId) &&
			!this.selectedLobby.beatmapIsPicked(beatmap.beatmapId);
	}

	showUnpickButton(beatmap: WyModBracketMap) {
		return !this.selectedLobby.beatmapIsBanned(beatmap.beatmapId) &&
			this.selectedLobby.beatmapIsPicked(beatmap.beatmapId);
	}

	beatmapIsPickedByTeamOne(multiplayerLobby: Lobby, beatmapId: number) {
		return multiplayerLobby.teamOnePicks != null && multiplayerLobby.teamOnePicks.indexOf(beatmapId) > -1;
	}

	beatmapIsPickedByTeamTwo(multiplayerLobby: Lobby, beatmapId: number) {
		return multiplayerLobby.teamTwoPicks != null && multiplayerLobby.teamTwoPicks.indexOf(beatmapId) > -1;
	}

	getPickedOrderOrdinal(multiplayerLobby: Lobby, beatmapId: number) {
		const teamOneIndex = multiplayerLobby.teamOnePicks?.indexOf(beatmapId) ?? -1;
		const teamTwoIndex = multiplayerLobby.teamTwoPicks?.indexOf(beatmapId) ?? -1;

		const teamOneFirstPick = multiplayerLobby.firstPick == multiplayerLobby.teamOneName;

		let pickOrder = null;

		if (teamOneIndex > -1) {
			pickOrder = teamOneFirstPick
				? teamOneIndex * 2 + 1
				: teamOneIndex * 2 + 2;
		}

		if (teamTwoIndex > -1) {
			pickOrder = teamOneFirstPick
				? teamTwoIndex * 2 + 2
				: teamTwoIndex * 2 + 1;
		}

		return pickOrder != null ? this.getOrdinal(pickOrder) : null;
	}

	getBannedOrderOrdinal(multiplayerLobby: Lobby, beatmapId: number) {
		const teamOneIndex = multiplayerLobby.teamOneBans?.indexOf(beatmapId) ?? -1;
		const teamTwoIndex = multiplayerLobby.teamTwoBans?.indexOf(beatmapId) ?? -1;

		const teamOneFirstBan = multiplayerLobby.firstBan == multiplayerLobby.teamOneName;

		let banOrder = null;

		if (teamOneIndex > -1) {
			banOrder = teamOneFirstBan
				? teamOneIndex * 2 + 1
				: teamOneIndex * 2 + 2;
		}

		if (teamTwoIndex > -1) {
			banOrder = teamOneFirstBan
				? teamTwoIndex * 2 + 2
				: teamTwoIndex * 2 + 1;
		}

		return banOrder != null ? this.getOrdinal(banOrder) : null;
	}

	banBeatmap(beatmap: WyModBracketMap, modBracket: WyModBracket, multiplayerLobby: Lobby) {
		this.banBeatmapEmitter.emit({ beatmap, modBracket, multiplayerLobby });
	}

	unbanBeatmap(beatmap: WyModBracketMap) {
		this.unbanBeatmapEmitter.emit(beatmap);
	}

	protectBeatmap(beatmap: WyModBracketMap, modBracket: WyModBracket, multiplayerLobby: Lobby) {
		this.protectBeatmapEmitter.emit({ beatmap, modBracket, multiplayerLobby });
	}

	unprotectBeatmap(beatmap: WyModBracketMap) {
		this.unprotectBeatmapEmitter.emit(beatmap);
	}

	changePickedBy(beatmap: WyModBracketMap) {
		this.changePickedByEmitter.emit(beatmap);
	}

	pickBeatmap(beatmap: WyModBracketMap, bracket: WyModBracket, gamemode: number) {
		this.pickBeatmapEmitter.emit({ beatmap, modBracket: bracket, gamemode });
	}

	unpickBeatmap(beatmap: WyModBracketMap) {
		this.unpickBeatmapEmitter.emit(beatmap);
	}

	private getOrdinal(numberValue: number): string {
		const suffixes = ['th', 'st', 'nd', 'rd'];
		const lastDigit = numberValue % 10;
		const suffix = lastDigit <= 3 && numberValue !== 11 && numberValue !== 12 && numberValue !== 13 ? suffixes[lastDigit] : suffixes[0];

		return `${numberValue}${suffix}`;
	}
}
