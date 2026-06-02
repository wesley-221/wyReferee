import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Lobby } from '../../../../models/lobby';
import { MultiplayerData } from '../../../../models/store-multiplayer/multiplayer-data';
import { CacheService } from '../../../../services/cache.service';
import { IrcService } from '../../../../services/irc.service';
import { Observable } from 'rxjs';
import { MatchDialogDataContextService } from '../../../../services/match-dialog-data-context.service';

@Component({
	selector: 'app-irc-match-result',
	templateUrl: './irc-match-result.component.html',
	styleUrl: './irc-match-result.component.scss'
})
export class IrcMatchResultComponent implements OnChanges {
	@Input() selectedLobby: Lobby;

	@Output() closeMatchDialogEmitter = new EventEmitter<void>();
	@Output() sendBeatmapResultEmitter = new EventEmitter<MultiplayerData>();
	@Output() updateMatchResultsEmitter = new EventEmitter<void>();

	hasWon$ = this.ircService.hasWon$;

	matchDialogData$: Observable<{ headerName: string; multiplayerData: MultiplayerData; sendFinalResult: boolean; }>;

	constructor(
		private cacheService: CacheService,
		private ircService: IrcService,
		private matchDialogDataContextService: MatchDialogDataContextService
	) { }

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['selectedLobby']?.currentValue) {
			this.matchDialogData$ = this.matchDialogDataContextService.getMatchDialogData(this.selectedLobby.lobbyId);
		}
	}

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
