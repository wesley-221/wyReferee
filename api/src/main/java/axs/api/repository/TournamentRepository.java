package axs.api.repository;

import axs.api.models.Tournament;
import org.springframework.data.repository.CrudRepository;

public interface TournamentRepository extends CrudRepository<Tournament, Integer> {
	Tournament findById(Long id);
}
