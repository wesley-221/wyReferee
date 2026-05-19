import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { MultiplayerData } from '../../../../models/store-multiplayer/multiplayer-data';
import { CacheService } from '../../../../services/cache.service';
import { IrcService } from '../../../../services/irc.service';
import { combineLatest, map } from 'rxjs';

@Component({
	selector: 'app-irc-match-result',
	templateUrl: './irc-match-result.component.html',
	styleUrl: './irc-match-result.component.scss'
})
export class IrcMatchResultComponent {
	@Input() selectedLobby: Lobby;

	@Output() closeMatchDialogEmitter = new EventEmitter<void>();
	@Output() sendBeatmapResultEmitter = new EventEmitter<MultiplayerData>();
	@Output() updateMatchResultsEmitter = new EventEmitter<void>();

	hasWon$ = this.ircService.hasWon$;

	matchDialogData$ = combineLatest([
		this.ircService.matchDialogHeaderName$,
		this.ircService.matchDialogMultiplayerData$,
		this.ircService.matchDialogSendFinalResult$
	]).pipe(
		map(([headerName, multiplayerData, sendFinalResult]) => ({
			headerName,
			multiplayerData,
			sendFinalResult
		}))
	);

	constructor(
		private cacheService: CacheService,
		private ircService: IrcService
	) { }

	getBeatmapName(beatmapId: number): string {
		return this.cacheService.getBeatmapname(beatmapId);
	}

	getBeatmapCoverUrl(beatmapId: number): string {
		return this.cacheService.getBeatmapCoverUrl(beatmapId);
	}

	closeMatchDialog() {
		this.closeMatchDialogEmitter.emit();
	}

	sendBeatmapResult(multiplayerData: MultiplayerData) {
		this.sendBeatmapResultEmitter.emit(multiplayerData);
	}

	updateMatchResults() {
		this.updateMatchResultsEmitter.emit();
	}
}
