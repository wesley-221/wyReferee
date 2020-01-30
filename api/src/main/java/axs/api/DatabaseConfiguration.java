package axs.api;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

@Configuration
public class DatabaseConfiguration {
	@Bean
	public DataSource getDataSource() {
		// Create the properties object
		Properties configFile = new Properties();
		DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();

		try {
			// Load the file
			InputStream input = new FileInputStream("src/main/resources/database.properties");
			configFile.load(input);

			// Set the connection variables
			dataSourceBuilder.url(configFile.getProperty("url"));
			dataSourceBuilder.username(configFile.getProperty("username"));
			dataSourceBuilder.password(configFile.getProperty("password"));
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}

		return dataSourceBuilder.build();
	}
}
