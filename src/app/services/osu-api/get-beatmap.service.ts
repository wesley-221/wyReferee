import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Beatmap } from '../../models/osu-models/beatmap';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { OsuApi, OsuApiEndpoints } from '../../models/osu-models/osu';

@Injectable({
	providedIn: 'root'
})

export class GetBeatmap extends OsuApi {
	constructor(private httpClient: HttpClient) {
		super(OsuApiEndpoints.GetBeatmaps);
	}

	/**
	 * Grab a beatmapset from the osu! api with the given beatmapsetId
	 *
	 * @param beatmapsetId the beatmapsetId to grab the data from
	 */
	public getByBeatmapId(beatmapsetId: number): Observable<Beatmap> {
		return from(window.electronApi.osuAuthentication.getApiKey()).pipe(
			switchMap(apiKey =>
				this.httpClient
					.get<Beatmap>(`${this.url}${this.endpoint}?k=${apiKey}&b=${beatmapsetId}`)
					.pipe(map(data => this.serializeFromJson(data)))
			)
		);
	}

	private serializeFromJson(json: any): Beatmap {
		// Check if the returned value is empty
		if (Object.entries(json).length == 0) {
			return new Beatmap();
		}

		const beatmap = new Beatmap();

		// Unwrap json object > osu api gives back [{...}]
		[json] = json;

		beatmap.approved = json.approved;
		beatmap.submit_date = json.submit_date;
		beatmap.approved_date = json.approved_date;
		beatmap.last_update = json.last_update;
		beatmap.artist = json.artist;
		beatmap.beatmap_id = json.beatmap_id;
		beatmap.beatmapset_id = json.beatmapset_id;
		beatmap.bpm = json.bpm;
		beatmap.creator = json.creator;
		beatmap.creator_id = json.creator_id;
		beatmap.difficultyrating = json.difficultyrating;
		beatmap.diff_aim = json.diff_aim;
		beatmap.diff_speed = json.diff_speed;
		beatmap.diff_size = json.diff_size;
		beatmap.diff_overall = json.diff_overall;
		beatmap.diff_approach = json.diff_approach;
		beatmap.diff_drain = json.diff_drain;
		beatmap.hit_length = json.hit_length;
		beatmap.source = json.source;
		beatmap.genre_id = json.genre_id;
		beatmap.language_id = json.language_id;
		beatmap.title = json.title;
		beatmap.total_length = json.total_length;
		beatmap.version = json.version;
		beatmap.file_md5 = json.file_md5;
		beatmap.mode = json.mode;
		beatmap.tags = json.tags;
		beatmap.favourite_count = json.favourite_count;
		beatmap.rating = json.rating;
		beatmap.playcount = json.playcount;
		beatmap.passcount = json.passcount;
		beatmap.count_normal = json.count_normal;
		beatmap.count_slider = json.count_slider;
		beatmap.count_spinner = json.count_spinner;
		beatmap.max_combo = json.max_combo;
		beatmap.download_unavailable = json.download_unavailable;
		beatmap.audio_unavailable = json.audio_unavailable;

		return beatmap;
	}
}
