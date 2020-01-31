package axs.api.models.authentication;

public class AuthRoute {
	private String url;
	private boolean requiresAdmin;

	public AuthRoute(String url, boolean requiresAdmin) {
		this.url = url;
		this.requiresAdmin = requiresAdmin;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public boolean isRequiresAdmin() {
		return requiresAdmin;
	}

	public void setRequiresAdmin(boolean requiresAdmin) {
		this.requiresAdmin = requiresAdmin;
	}
}
