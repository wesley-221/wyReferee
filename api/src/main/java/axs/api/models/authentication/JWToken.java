package axs.api.models.authentication;

import io.jsonwebtoken.*;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

public class JWToken {
	private static final String JWT_USERID_CLAIM = "id";
	private static final String JWT_USERNAME_CLAIM = "username";
	private static final String JWT_ADMIN_CLAIM = "admin";

	private Long userId = null;
	private String username = null;
	private boolean isAdmin = false;

	public JWToken(Long userId, String username, boolean isAdmin) {
		this.userId = userId;
		this.username = username;
		this.isAdmin = isAdmin;
	}

	private static Key getKey(String passPhrase) {
		byte hmacKey[] = passPhrase.getBytes(StandardCharsets.UTF_8);
		return new SecretKeySpec(hmacKey, SignatureAlgorithm.HS512.getJcaName());
	}

	public String encode(String issuer, String passphrase) {
		Key key = getKey(passphrase);
		return Jwts.builder()
			.claim(JWT_USERID_CLAIM, this.userId)
			.claim(JWT_USERNAME_CLAIM, this.username)
			.claim(JWT_ADMIN_CLAIM, this.isAdmin)
			.setIssuer(issuer)
			.setIssuedAt(new Date())
			.signWith(key, SignatureAlgorithm.HS512)
			.compact();
	}

	public static JWToken decode(String token, String passPhrase) {
		try {
			Key key = getKey(passPhrase);
			Jws<Claims> jws = Jwts.parser().setSigningKey(key).parseClaimsJws(token);
			Claims claims = jws.getBody();

			return new JWToken(
				Long.valueOf(claims.get(JWT_USERID_CLAIM).toString()),
				claims.get(JWT_USERNAME_CLAIM).toString(),
				(boolean) claims.get(JWT_ADMIN_CLAIM)
			);
		}
		catch (ExpiredJwtException | MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e){
			return null;
		}
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public boolean isAdmin() {
		return isAdmin;
	}

	public void setAdmin(boolean admin) {
		isAdmin = admin;
	}
}
