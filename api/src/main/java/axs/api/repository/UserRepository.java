package axs.api.repository;

import axs.api.models.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
	User findById(Long id);
	boolean existsByUsername(String username);
}
