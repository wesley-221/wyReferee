package axs.api.rest;

import axs.api.models.authentication.JWToken;
import axs.api.models.authentication.RegisterRequest;
import axs.api.models.authentication.User;
import axs.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
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

	@Value("${jwt.issuer}")
	private String issuer;

	@Value("${jwt.passphrase}")
	private String passphrase;

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

	@PostMapping("/login")
	public ResponseEntity<Object> login(@RequestBody RegisterRequest registerRequest) {
		User user = userRepository.findByUsername(registerRequest.getUsername());

		// Check if the user exists
		if(user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid username or password given.\"}");
		}

		// Check if the correct password is given
		if(!passwordEncoder.matches(registerRequest.getPassword(), user.getPassword())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid username or password given.\"}");
		}

		JWToken jwToken = new JWToken(user.getId(), user.getUsername(), user.isAdmin());
		String token = jwToken.encode(this.issuer, this.passphrase);

		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.AUTHORIZATION, token);

		return new ResponseEntity<>("{ \"message\": \"Successfully logged in.\", \"userId\": \"" + user.getId() + "\", \"username\": \"" + user.getUsername() + "\", \"admin\": \"" + user.isAdmin() + "\" }", headers, HttpStatus.OK);
	}
}
