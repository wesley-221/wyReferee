package axs.api.rest;

import axs.api.models.Mappool;
import axs.api.models.ModBracket;
import axs.api.models.ModBracketMap;
import axs.api.repository.MappoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
public class MappoolController {
	@Autowired
	MappoolRepository mappoolRepository;

	@GetMapping("/mappool/get/{id}")
	public ResponseEntity<Mappool> getMappool(@PathVariable Long id) {
		Mappool mappool = mappoolRepository.findById(id);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();

		if(mappool == null) {
			return ResponseEntity.notFound().location(uri).build();
		}

		return ResponseEntity.ok().location(uri).body(mappool);
	}

	@PostMapping("/mappool/create")
	public ResponseEntity<Mappool> createMappool(@RequestBody Mappool mappool) {
		Mappool savedMappool = mappoolRepository.save(mappool);
		return new ResponseEntity<>(savedMappool, HttpStatus.CREATED);
	}
}
