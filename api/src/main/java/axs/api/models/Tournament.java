package axs.api.models;

import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import javax.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CascadeType;

@Entity
public class Tournament {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String tournamentName;
	private String acronym;

	@OneToMany(mappedBy = "tournament")
	@Cascade({CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
	private List<Team> teams = new ArrayList<>();

	public Tournament() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTournamentName() {
		return tournamentName;
	}

	public void setTournamentName(String tournamentName) {
		this.tournamentName = tournamentName;
	}

	public String getAcronym() {
		return acronym;
	}

	public void setAcronym(String acronym) {
		this.acronym = acronym;
	}

	public List<Team> getTeams() {
		return teams;
	}

	public void setTeams(List<Team> teams) {
		for(Team team : teams) {
			team.setTournament(this);
		}

		this.teams = teams;
	}
}
