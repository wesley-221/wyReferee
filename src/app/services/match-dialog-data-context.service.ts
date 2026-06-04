import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { MultiplayerData } from '../models/store-multiplayer/multiplayer-data';

@Injectable({
	providedIn: 'root'
})
export class MatchDialogDataContextService {
	matchDialogData: {
		[key: string]: {
			headerName$: BehaviorSubject<string>;
			multiplayerData$: BehaviorSubject<MultiplayerData>;
			sendFinalResult$: BehaviorSubject<boolean>;
		}
	};

	constructor() {
		this.matchDialogData = {};
	}

	initializeMatchDialogData(lobbyId: number): void {
		this.matchDialogData[lobbyId] = {
			headerName$: new BehaviorSubject(''),
			multiplayerData$: new BehaviorSubject(null),
			sendFinalResult$: new BehaviorSubject(false)
		};
	}

	getMatchDialogData(lobbyId: number): Observable<{ headerName: string; multiplayerData: MultiplayerData; sendFinalResult: boolean; }> {
		if (!this.matchDialogData[lobbyId]) {
			this.initializeMatchDialogData(lobbyId);
		}

		return combineLatest([
			this.matchDialogData[lobbyId].headerName$,
			this.matchDialogData[lobbyId].multiplayerData$,
			this.matchDialogData[lobbyId].sendFinalResult$
		]).pipe(
			map(([headerName, multiplayerData, sendFinalResult]) => ({ headerName, multiplayerData, sendFinalResult }))
		);
	}

	setMatchDialogData(lobbyId: number, headerName: string, multiplayerData: MultiplayerData, sendFinalResult: boolean): void {
		if (!this.matchDialogData[lobbyId]) {
			this.initializeMatchDialogData(lobbyId);
		}

		this.matchDialogData[lobbyId].headerName$.next(headerName);
		this.matchDialogData[lobbyId].multiplayerData$.next(multiplayerData);
		this.matchDialogData[lobbyId].sendFinalResult$.next(sendFinalResult);
	}

	clearMatchDialogData(lobbyId: number): void {
		if (this.matchDialogData[lobbyId]) {
			this.matchDialogData[lobbyId].headerName$.next('');
			this.matchDialogData[lobbyId].multiplayerData$.next(null);
			this.matchDialogData[lobbyId].sendFinalResult$.next(false);
		}
	}

	deleteMatchDialogData(lobbyId: number): void {
		delete this.matchDialogData[lobbyId];
	}
}
