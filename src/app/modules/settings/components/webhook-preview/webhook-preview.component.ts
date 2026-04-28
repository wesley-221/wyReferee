import { Component, Input } from '@angular/core';
import { IrcService } from '../../../../services/irc.service';

@Component({
	selector: 'app-webhook-preview',
	templateUrl: './webhook-preview.component.html',
	styleUrl: './webhook-preview.component.scss'
})
export class WebhookPreviewComponent {
	webhookTitle = 'Grand finals: **Team 1** vs. **Team 2**';
	webhookDescription = '**Score:** Team 1 | 5 - **7** | __Team 2__ \n\n**First pick**: Team 1\n\n[Link to multiplayer match](https://osu.ppy.sh/community/matches)';
	webhookTeamOneBans = {
		name: 'Team 1 bans:',
		value: '[verschillende artiesten inderdaad - cwc petje iv : poetst kevin zijn duitse helm? [hoeveel pp is dat extra? ohja 0.0 boeie kuthoer]](https://osu.ppy.sh/beatmapsets/1167019#fruits/2434339)\n\n[verschillende artiesten - CWC Petje IIII : Maar Eigenlijk Is het II [het is weer weekend want ik mag de bel weer luiden :3/]](https://osu.ppy.sh/beatmapsets/995293#fruits/2082080)'
	};
	webhookTeamTwoBans = {
		name: 'Team 2 bans:',
		value: '[Verschillende artiesten - CWC Petje I : Genesis Novae Terrae [het huis is niet smerig het heeft gewoon een doekje nodig]](https://osu.ppy.sh/beatmapsets/796116#fruits/1671755)\n\n[Verschillende artiesten - Nederlands Kampioenschap,s petje [nederlandse samenwerking met de nl boys en n0ah want hij is roemeens :romania:]](https://osu.ppy.sh/beatmapsets/622291#fruits/1311962)'
	};
	webhookAdditionalMessage = {
		name: 'Additional message by Wesley',
		value: 'Very interesting extra message'
	};

	@Input() webhookAuthorImage: string;
	@Input() webhookAuthorName: string;

	@Input() webhookBottomImage: string;

	@Input() webhookFooterIconUrl: string;
	@Input() webhookFooterText: string;

	constructor(
		public ircService: IrcService
	) { }
}
