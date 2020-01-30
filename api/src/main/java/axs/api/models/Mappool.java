package axs.api.models;

import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import javax.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CascadeType;

@Entity
public class Mappool {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private int gamemodeId;

	@OneToMany(mappedBy = "mappool")
	@Cascade({CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
	private List<ModBracket> modBrackets = new ArrayList<>();

	public Mappool() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getGamemodeId() {
		return gamemodeId;
	}

	public void setGamemodeId(int gamemodeId) {
		this.gamemodeId = gamemodeId;
	}

	public List<ModBracket> getModBrackets() {
		return modBrackets;
	}

	public void setModBrackets(List<ModBracket> modBrackets) {
		for(ModBracket modBracket : modBrackets) {
			modBracket.setMappool(this);
		}

		this.modBrackets = modBrackets;
	}
}
