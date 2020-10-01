/* SystemJS module definition */
declare var nodeModule: NodeModule;
interface NodeModule {
	id: string;
}
interface Window {
	process: any;
	require: any;
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
