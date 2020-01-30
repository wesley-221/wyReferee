package axs.api.repository;

import axs.api.models.Mappool;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.ResponseEntity;

public interface MappoolRepository extends CrudRepository<Mappool, Integer> {
	Mappool findById(Long id);
}
