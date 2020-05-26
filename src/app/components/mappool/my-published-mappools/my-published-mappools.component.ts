import { Component, OnInit } from '@angular/core';
import { Mappool } from '../../../models/osu-mappool/mappool';
import { MappoolService } from '../../../services/mappool.service';
import { AuthenticateService } from '../../../services/authenticate.service';

@Component({
	selector: 'app-my-published-mappools',
	templateUrl: './my-published-mappools.component.html',
	styleUrls: ['./my-published-mappools.component.scss']
})
export class MyPublishedMappoolsComponent implements OnInit {
	publishedMappools: Mappool[] = [];

	constructor(private mappoolService: MappoolService, private auth: AuthenticateService) {
		this.mappoolService.getAllPublishedMappoolsFromUser(auth.loggedInUser).subscribe(data => {
			for (let mappool in data) {
				const newMappool: Mappool = Mappool.serializeJson(data[mappool]);
				this.publishedMappools.push(newMappool);
			}
		});
	}

	ngOnInit(): void { }
}
