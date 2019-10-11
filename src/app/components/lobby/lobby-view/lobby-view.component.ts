import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MultiplayerLobby } from '../../../models/store-multiplayer/multiplayer-lobby';
import { MultiplayerLobbiesService } from '../../../services/multiplayer-lobbies.service';
import { ElectronService } from '../../../services/electron.service';
import { ToastService } from '../../../services/toast.service';
import { CacheService } from '../../../services/cache.service';
import { MultiplayerData } from '../../../models/store-multiplayer/multiplayer-data';
import { MultiplayerDataUser } from '../../../models/store-multiplayer/multiplayer-data-user';
import { MappoolService } from '../../../services/mappool.service';

@Component({
	selector: 'app-lobby-view',
	templateUrl: './lobby-view.component.html',
	styleUrls: ['./lobby-view.component.scss']
})

export class LobbyViewComponent implements OnInit {
	selectedLobby: MultiplayerLobby;

	constructor(
		private route: ActivatedRoute, 
		private multiplayerLobbies: MultiplayerLobbiesService, 
		private toastService: ToastService, 
		private cacheService: CacheService,
		public electronService: ElectronService, 
		public mappoolService: MappoolService) {
		this.route.params.subscribe(params => {
			this.selectedLobby = multiplayerLobbies.get(params.id);
		});
	}

	ngOnInit() { }

	/**
	 * Synchronizes the multiplayer lobby and calculates all the scores
	 */
	synchronizeMp() {
		this.toastService.addToast('Synchronizing multiplayer lobby...');

		// console.time('synchronize-lobby');
		this.multiplayerLobbies.synchronizeMultiplayerMatch(this.selectedLobby);
		// console.timeEnd('synchronize-lobby');
	}

	/**
	 * Change the mappool for the selected lobby
	 * @param event the event that is triggered
	 */
	changeMappool(event: any) {
		this.multiplayerLobbies.get(this.selectedLobby.lobbyId).mappool = this.mappoolService.getMappool(event.target.value);
	}

	/**
	 * Get the mappool id of the selected lobby
	 */
	getMappoolId() {
		if(this.selectedLobby.mappool == null) {
			if(this.selectedLobby.mappoolId != null) {
				return this.selectedLobby.mappoolId;
			}
		}
		else {
			return this.selectedLobby.mappool.id;
		}
		
		return -1;
	}

	/**
	 * Get the modifier for the given beatmapid 
	 * @param beatmapId the beatmapid to get the modifier for
	 */
	getModifier(beatmapId: number) {
		if(this.selectedLobby.mappool == null) {
			return null;
		}
		else {
			if(this.selectedLobby.mappool.modifiers.hasOwnProperty(beatmapId)) {
				return this.selectedLobby.mappool.modifiers[beatmapId].modifier;
			}
		}

		return null;
	}

	/**
	 * Get the cached beatmap if it exists
	 * @param beatmapId the beatmapid
	 */
	getBeatmapname(beatmapId: number) {
		const cachedBeatmap = this.cacheService.getCachedBeatmap(beatmapId);
		return (cachedBeatmap != null) ? cachedBeatmap.name : `Unknown beatmap, synchronize the lobby to get the map name.`;
	}
	
	/**
	 * Get the beatmap image
	 * @param beatmapId the beatmapid
	 */
	getThumbUrl(beatmapId: number) {
		const cachedBeatmap = this.cacheService.getCachedBeatmap(beatmapId);
		return (cachedBeatmap != null) ? `url('https://b.ppy.sh/thumb/${cachedBeatmap.beatmapset_id}.jpg')` : ``;
	}

	/**
	 * Get the cached username 
	 * @param userId the userid
	 */
	getUsernameFromUserId(userId: number) {
		const cachedUser = this.cacheService.getCachedUser(userId);
		return (cachedUser != null) ? cachedUser.username : "Unknown";
	}

	/**
	 * Get the accuracy of the player in the given slot
	 * @param match the MultiplayerData
	 * @param slotId the slot you want the accuracy from
	 */
	getAccuracy(match: MultiplayerData, slotId: number) {
		const user: MultiplayerDataUser = match.getPlayer(slotId);

		return (user != undefined) ? user.accuracy : 0.00
	}

	/**
	 * Get the score of the player in the given slot
	 * @param match the MultiplayerData
	 * @param slotId the slot you want the score from
	 */
	getScore(match: MultiplayerData, slotId: number) {
		const user: MultiplayerDataUser = match.getPlayer(slotId);

		return (user != undefined) ? this.addDot(user.score.toFixed(), " ") : 0;
	}

	/**
	 * Split the string 
	 * @param nStr the string to split
	 * @param splitter the character to split the string with
	 */
	addDot(nStr, splitter) {
        nStr += '';
        const x = nStr.split('.');
        let x1 = x[0];
        const x2 = x.length > 1 ? '.' + x[1] : '';
        const rgx = /(\d+)(\d{3})/;

        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + splitter + '$2');
        }

        return x1 + x2;
    }
}
