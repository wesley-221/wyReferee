import { Injectable } from "@angular/core";
import { OsuApi, OsuApiEndpoints } from "../../models/osu-models/osu-api";
import { StoreService } from "../store.service";
import { HttpClient } from "@angular/common/http";
import { User } from "../../models/user";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class GetUser extends OsuApi {
    constructor(private httpClient: HttpClient, private storeService: StoreService) {
        super(storeService.get('api-key'), OsuApiEndpoints.GetUser);
    }

    /**
     * Get the user data of the given username and gamemode
     * @param username the username
     * @param gamemode the gamemode 
     */
    public getByUsername(username: string, gamemode: number = 0): Observable<User> {
        return this.httpClient.get<User>(`${this.url}${this.endpoint}?k=${this.key}&u=${username}&type=string&m=${gamemode}`)
        .pipe(
            map((data: any) => this.serializeFromJson(data))
        );
    }

    /**
     * Get the user data of the given userid and gamemode
     * @param userid the userid
     * @param gamemode the gamemode 
     */
    public getByUserId(userid: number, gamemode: number = 0): Observable<User> {
        return this.httpClient.get<User>(`${this.url}${this.endpoint}?k=${this.key}&u=${userid}&type=id&m=${gamemode}`)
        .pipe(
            map((data: any) => this.serializeFromJson(data))
        );
    }

    private serializeFromJson(json: any): User {
        const user = new User();

        [json] = json;

        user.user_id = json.user_id
        user.username = json.username
        user.join_date = json.join_date
        user.count300 = json.count300
        user.count100 = json.count100
        user.count50 = json.count50
        user.playcount = json.playcount
        user.ranked_score = json.ranked_score
        user.total_score = json.total_score
        user.pp_rank = json.pp_rank
        user.level = json.level
        user.pp_raw = json.pp_raw
        user.accuracy = json.accuracy
        user.count_rank_ss = json.count_rank_ss
        user.count_rank_ssh = json.count_rank_ssh
        user.count_rank_s = json.count_rank_s
        user.count_rank_sh = json.count_rank_sh
        user.count_rank_a = json.count_rank_a
        user.country = json.country
        user.total_seconds_played = json.total_seconds_played
        user.pp_country_rank = json.pp_country_rank

        return user;
    }
}
