package axs.api.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class ModBracketMap {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private int beatmapId;
	private String beatmapName;
	private String beatmapUrl;
	private int modifier;
	private int gamemodeId;

	@ManyToOne
	@JsonIgnore
	private ModBracket modBracket;

	public ModBracketMap() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getBeatmapId() {
		return beatmapId;
	}

	public void setBeatmapId(int beatmapId) {
		this.beatmapId = beatmapId;
	}

	public String getBeatmapName() {
		return beatmapName;
	}

	public void setBeatmapName(String beatmapName) {
		this.beatmapName = beatmapName;
	}

	public String getBeatmapUrl() {
		return beatmapUrl;
	}

	public void setBeatmapUrl(String beatmapUrl) {
		this.beatmapUrl = beatmapUrl;
	}

	public int getModifier() {
		return modifier;
	}

	public void setModifier(int modifier) {
		this.modifier = modifier;
	}

	public int getGamemodeId() {
		return gamemodeId;
	}

	public void setGamemodeId(int gamemodeId) {
		this.gamemodeId = gamemodeId;
	}

	public ModBracket getModBracket() {
		return modBracket;
	}

	public void setModBracket(ModBracket modBracket) {
		this.modBracket = modBracket;
	}
}
