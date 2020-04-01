package axs.api.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CascadeType;

@Entity
public class Team {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JsonIgnore
	private Tournament tournament;

	private String teamName;

	@OneToMany(mappedBy = "team")
	@Cascade({CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
	private List<TeamPlayer> teamPlayers = new ArrayList<>();

	public Team() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTeamName() {
		return teamName;
	}

	public void setTeamName(String teamName) {
		this.teamName = teamName;
	}

	public Tournament getTournament() {
		return tournament;
	}

	public void setTournament(Tournament tournament) {
		this.tournament = tournament;
	}

	public List<TeamPlayer> getTeamPlayers() {
		return teamPlayers;
	}

	public void setTeamPlayers(List<TeamPlayer> teamPlayers) {
		for(TeamPlayer teamPlayer : teamPlayers) {
			teamPlayer.setTeam(this);
		}

		this.teamPlayers = teamPlayers;
	}
}
