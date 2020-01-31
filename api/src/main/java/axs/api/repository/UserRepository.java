package axs.api.repository;

import axs.api.models.authentication.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
	User findById(Long id);
	User findByUsername(String username);
	boolean existsByUsername(String username);
}
