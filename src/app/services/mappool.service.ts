import { Injectable } from '@angular/core';
import { ModBracket } from '../models/osu-mappool/mod-bracket';
import { Mappool } from '../models/osu-mappool/mappool';

@Injectable({
  	providedIn: 'root'
})

export class MappoolService {
	creationMappool: Mappool;

	allMappools: Mappool[] = [];

  	constructor() {
		this.creationMappool = new Mappool();
	}
}
