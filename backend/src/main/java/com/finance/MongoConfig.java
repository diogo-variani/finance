package com.finance;

import static  java.util.Collections.singletonList;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;

@Configuration
@EnableMongoRepositories(basePackages = "com.finance.repository")
public class MongoConfig extends AbstractMongoConfiguration {

	@Value("${spring.data.mongodb.host}")
	private String host;

	@Value("${spring.data.mongodb.port}")
	private Integer port;

	@Value("${spring.data.mongodb.username}")
	private String username;

	@Value("${spring.data.mongodb.password}")
	private String password;

	@Value("${spring.data.mongodb.database}")
	private String database;

	@Autowired
	private MongoDbFactory mongoDbFactory;

	@Override
	public MongoClient mongoClient() {
		List<ServerAddress> serverAddresses = singletonList(new ServerAddress(host, port));
		MongoCredential credential = MongoCredential.createCredential(username, database, password.toCharArray());
		MongoClientOptions options = MongoClientOptions.builder().build();
		
		return new MongoClient(serverAddresses, credential, options);
	}

	@Override
	public MongoTemplate mongoTemplate() throws Exception {
		DbRefResolver dbRefResolver = new DefaultDbRefResolver(mongoDbFactory);

		// Remove _class
		MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, new MongoMappingContext());
		converter.setTypeMapper(new DefaultMongoTypeMapper(null));

		return new MongoTemplate(this.mongoDbFactory(), converter);
	}

	@Override
	protected String getDatabaseName() {
		return database;
	}


	
}
