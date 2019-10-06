import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MultiplayerLobby } from '../../models/multiplayer-lobby';
import { MultiplayerLobbiesService } from '../../services/multiplayer-lobbies.service';
import { ElectronService } from '../../services/electron.service';

@Component({
	selector: 'app-lobby-view',
	templateUrl: './lobby-view.component.html',
	styleUrls: ['./lobby-view.component.scss']
})

export class LobbyViewComponent implements OnInit {
	selectedLobby: MultiplayerLobby;

	teamOneScore = 8;
	teamTwoScore = 5;

	constructor(private route: ActivatedRoute, private multiplayerLobbies: MultiplayerLobbiesService, private elctronService: ElectronService) {
		this.route.params.subscribe(params => {
			this.selectedLobby = multiplayerLobbies.get(params.id);

			console.log(this.selectedLobby)
		});
	}

	ngOnInit() { }

	getThumbUrl(thumbName: string) {
		return `url('https://b.ppy.sh/thumb/${thumbName}.jpg')`;
	}

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
