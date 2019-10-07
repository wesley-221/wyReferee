import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreService } from './store.service';
import { OsuApiEndpoints, OsuApi } from '../models/osu-api';
import { Observable } from 'rxjs';
import { MultiplayerMatch } from '../models/multiplayer-match';
import { map } from 'rxjs/operators';
import { MultiplayerGame } from '../models/multiplayer-game';
import { MultiplayerGameScore } from '../models/multiplayer-game-score';

@Injectable({
  	providedIn: 'root'
})

export class GetMultiplayerService extends OsuApi {
	constructor(private httpClient: HttpClient, private storeService: StoreService) {
        super(storeService.get('api-key'), OsuApiEndpoints.GetMultiplayer);
	}
	
	/**
     * Get the multiplayerdata from the given url
     * @param multiplayerLink the multiplayerlink
     */
    public get(multiplayerLink: string): Observable<MultiplayerMatch> {
		const multiplayerId = this.getMultiplayerIdFromUrl(multiplayerLink);

        return this.httpClient.get<MultiplayerMatch>(`${this.url}${this.endpoint}?k=${this.key}&mp=${multiplayerId}`)
        .pipe(
            map((data: any) => this.serializeFromJson(data))
        );
	}

	/**
	 * Serialize the json file to MultiplayerMatch()
	 * @param json the json
	 */
	private serializeFromJson(json: any): MultiplayerMatch {
		const mp = new MultiplayerMatch();
		
		mp.name = json.match.name;
		mp.match_id = json.match.match_id;
		mp.start_time = json.match.start_time;
		mp.end_time = json.match.end_time;

		for(let game in json.games) {
			const 	currentGame = json.games[game], 
					newGame = new MultiplayerGame();

			newGame.beatmap_id = currentGame.beatmap_id;
			newGame.end_time = currentGame.end_time;
			newGame.game_id = currentGame.game_id;
			newGame.match_type = currentGame.match_type;
			newGame.mods = currentGame.mods;
			newGame.play_mode = currentGame.play_mode;
			newGame.scoring_type = currentGame.scoring_type;
			newGame.start_time = currentGame.start_time;
			newGame.team_type = currentGame.team_type;

			for(let score in currentGame.scores) {
				const 	currentScore = currentGame.scores[score],
						newScore = new MultiplayerGameScore();

				newScore.count50 = currentScore.count50
				newScore.count100 = currentScore.count100
				newScore.count300 = currentScore.count300
				newScore.countgeki = currentScore.countgeki
				newScore.countkatu = currentScore.countkatu
				newScore.countmiss = currentScore.countmiss
				newScore.enabled_mods = currentScore.enabled_mods
				newScore.maxcombo = currentScore.maxcombo
				newScore.pass = currentScore.pass
				newScore.perfect = currentScore.perfect
				newScore.rank = currentScore.rank
				newScore.score = currentScore.score
				newScore.slot = currentScore.slot
				newScore.team = currentScore.team
				newScore.user_id = currentScore.user_id

				newGame.scores.push(currentScore);
			}
			
			mp.games.push(newGame);
		}

        return mp;
	}

	/**
	 * Get the id of the given multiplayer url
	 * @param url the complete url
	 */
	private getMultiplayerIdFromUrl(url: string) {
        const regularExpression = new RegExp(/https:\/\/osu\.ppy\.sh\/community\/matches\/([0-9]+)/).exec(url);

        if(regularExpression) {
            return regularExpression[1];
        }

        return false;
    }
}
