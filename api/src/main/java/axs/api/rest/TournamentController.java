package axs.api.rest;

import axs.api.models.Tournament;
import axs.api.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
public class TournamentController {
	@Autowired
	TournamentRepository tournamentRepository;

	@GetMapping("/tournament/get")
	public ResponseEntity<List<Tournament>> getAllTournaments() {
		List<Tournament> tournaments = (List<Tournament>) tournamentRepository.findAll();
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();

		return ResponseEntity.ok().location(uri).body(tournaments);
	}

	@GetMapping("/tournament/get/{id}")
	public ResponseEntity<Tournament> getTournament(@PathVariable Long id) {
		Tournament tournament = tournamentRepository.findById(id);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();

		if(tournament == null) {
			return ResponseEntity.notFound().location(uri).build();
		}

		return ResponseEntity.ok().location(uri).body(tournament);
	}

	@PostMapping("/tournament/create")
	public ResponseEntity<Tournament> createTournament(@RequestBody Tournament tournament) {
		Tournament savedTournament = tournamentRepository.save(tournament);
		return new ResponseEntity<>(savedTournament, HttpStatus.CREATED);
	}
}
