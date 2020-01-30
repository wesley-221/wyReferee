package axs.api.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CascadeType;

@Entity
public class ModBracket {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String bracketName;
	private String mods;

	@ManyToOne
	@JsonIgnore
	private Mappool mappool;

	@OneToMany(mappedBy = "modBracket")
	@Cascade({CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
	private List<ModBracketMap> beatmaps = new ArrayList<>();

	public ModBracket() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getBracketName() {
		return bracketName;
	}

	public void setBracketName(String bracketName) {
		this.bracketName = bracketName;
	}

	public String getMods() {
		return mods;
	}

	public void setMods(String mods) {
		this.mods = mods;
	}

	public Mappool getMappool() {
		return mappool;
	}

	public void setMappool(Mappool mappool) {
		this.mappool = mappool;
	}

	public List<ModBracketMap> getBeatmaps() {
		return beatmaps;
	}

	public void setBeatmaps(List<ModBracketMap> beatmaps) {
		for(ModBracketMap modBracketMap : beatmaps) {
			modBracketMap.setModBracket(this);
		}

		this.beatmaps = beatmaps;
	}
}
