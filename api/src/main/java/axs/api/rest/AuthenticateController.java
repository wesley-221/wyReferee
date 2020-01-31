package axs.api.rest;

import axs.api.models.RegisterRequest;
import axs.api.models.User;
import axs.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
public class AuthenticateController {
	@Autowired
	UserRepository userRepository;

	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	@PostMapping("/register")
	public ResponseEntity<Object> register(@RequestBody RegisterRequest registerRequest) {
		if(userRepository.existsByUsername(registerRequest.getUsername())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"message\": \"The username \\\"" + registerRequest.getUsername() + "\\\" is already in use.\"}");
		}

		if(!registerRequest.getPassword().equals(registerRequest.getPasswordConfirm())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"message\": \"The passwords you have entered do not match.\"}");
		}

		User user = new User();

		user.setUsername(registerRequest.getUsername());
		user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

		userRepository.save(user);

		return ResponseEntity.status(HttpStatus.CREATED).body("{\"message\": \"Successfully registered your account.\"}");
	}
}
