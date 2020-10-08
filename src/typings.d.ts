/* SystemJS module definition */
declare var nodeModule: NodeModule;
interface NodeModule {
	id: string;
}
interface Window {
	process: any;
	require: any;
}

declare class ChallongeTournament {
	accept_attachments: boolean;
	allow_participant_match_reporting: boolean;
	anonymous_voting: boolean;
	category: any;
	check_in_duration: any;
	completed_at: any;
	created_at: string;
	created_by_api: boolean;
	credit_capped: boolean;
	description: string;
	game_id: number;
	group_stages_enabled: boolean;
	hide_forum: boolean;
	hide_seeds: boolean;
	hold_third_place_match: boolean;
	id: number;
	max_predictions_per_user: number;
	name: string;
	notify_users_when_matches_open: boolean;
	notify_users_when_the_tournament_ends: boolean;
	open_signup: boolean;
	participants_count: number;
	prediction_method: number;
	predictions_opened_at: any;
	private: boolean;
	progress_meter: number;
	pts_for_bye: string;
	pts_for_game_tie: string;
	pts_for_game_win: string;
	pts_for_match_tie: string;
	pts_for_match_win: string;
	quick_advance: boolean;
	ranked_by: string;
	require_score_agreement: boolean;
	rr_pts_for_game_tie: string;
	rr_pts_for_game_win: string;
	rr_pts_for_match_tie: string;
	rr_pts_for_match_win: string;
	sequential_pairings: boolean;
	show_rounds: boolean;
	signup_cap: any;
	start_at: any;
	started_at: any;
	started_checking_in_at: any;
	state: string;
	swiss_rounds: number;
	teams: boolean;
	tie_breaks: string[];
	tournament_type: string;
	updated_at: string;
	url: string;
	description_source: string;
	subdomain: any;
	full_challonge_url: string;
	live_image_url: string;
	sign_up_url: any;
	review_before_finalizing: boolean;
	accepting_predictions: boolean;
	participants_locked: boolean;
	game_name: string;
	participants_swappable: boolean;
	team_convertable: boolean;
	group_stages_were_started: boolean;
}

declare class ChallongeMatch {
	id: number;
	tournament_id: number;
	state: string;
	player1_id: number;
	player2_id: number;
	player1: ChallongeParticipant;
	player2: ChallongeParticipant;
	player1_prereq_match_id: any;
	player2_prereq_match_id: any;
	player1_prereq_match: ChallongeMatch;
	player2_prereq_match: ChallongeMatch;
	player1_is_prereq_match_loser: boolean;
	player2_is_prereq_match_loser: boolean;
	winner_id: number;
	loser_id: number;
	started_at: string;
	created_at: string;
	updated_at: string;
	identifier: string;
	has_attachment: boolean;
	round: number;
	player1_votes: any;
	player2_votes: any;
	group_id: any;
	attachment_count: any;
	scheduled_time: any;
	location: any;
	underway_at: any;
	optional: boolean;
	rushb_id: any;
	completed_at: string;
	suggested_play_order: 3;
	forfeited: any;
	open_graph_image_file_name: any;
	open_graph_image_content_type: any;
	open_graph_image_file_size: any;
	prequisite_match_ids_csv: string;
	scores_csv: string;
	getPlayer1Name: Function;
	getPlayer2Name: Function;
	getScore: Function;
}

declare class ChallongeParticipant {
	id: number;
	tournament_id: number;
	name: string;
	seed: number;
	active: boolean;
	created_at: string;
	updated_at: string;
	invite_email: string;
	final_rank: number;
	misc: any;
	icon: any;
	on_waiting_list: boolean;
	invitation_id: number;
	group_id: number;
	checked_in_at: any;
	ranked_member_id: any;
	custom_field_response: any;
	clinch: any;
	integration_uids: any;
	challonge_username: string;
	challonge_email_address_verified: any;
	removable: boolean;
	participatable_or_invitation_attached: boolean;
	confirm_remove: boolean;
	invitation_pending: boolean;
	display_name_with_invitation_email_address: string;
	email_hash: any;
	username: string;
	display_name: string;
	attached_participatable_portrait_url: any;
	can_check_in: boolean;
	checked_in: boolean;
	reactivatable: boolean;
	check_in_open: boolean;
	group_player_ids: any;
	has_irrelevant_seed: boolean;
}

declare class ElectronDownloadProgression {
	transferred: number;
	total: number;
	percent: number;
}
