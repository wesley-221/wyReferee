package axs.api.repository;

import axs.api.models.Mappool;
import org.springframework.data.repository.CrudRepository;

public interface MappoolRepository extends CrudRepository<Mappool, Integer> {
	Mappool findById(Long id);
}
